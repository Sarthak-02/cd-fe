import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Split a flat teacher record (as it would appear in the JSON file) into the
 * core POST payload and the extras object that the API stores under `extras`.
 *
 * Core fields mirror `createPayload` in AddEditTeacher.jsx.
 * Everything else is packed into `extras` and sent with the PUT (detail) call.
 */
function splitRecord(record) {
  const {
    teacher_id,
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id = "test",
    teacher_employee_code,
    teacher_photo_url = "",
    ...extras
  } = record;

  const core = {
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob: teacher_dob ? new Date(teacher_dob).toISOString() : null,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id,
    teacher_employee_code,
    teacher_photo_url,
    extras,
  };

  // If the record already carries a teacher_id (e.g. re-import), keep it.
  if (teacher_id) core.teacher_id = teacher_id;

  return core;
}

const CONFIG = {
  file: path.join(__dirname, "teachers-sample.json"),
  baseUrl: "http://127.0.0.1:5000",
  endpoint: "/onboarding/teacher",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJzYXJ0aGFrIiwiaWF0IjoxNzc5MjEwMDE2LCJleHAiOjE3NzkyOTY0MTZ9.Ych6Z3x3AgQtvn_J88JvI-_cz97RJRUDSRZLMzdKrUg",
  concurrency: 1,
  dryRun: false,
  skipDetail: false,
};

function normalizePayload(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.teachers)) return json.teachers;
    return [json];
  }
  throw new Error("Unsupported JSON format. Provide an array or an object with a `teachers` key.");
}

async function asyncPool(limit, items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  const runOne = async () => {
    for (;;) {
      const i = nextIndex;
      nextIndex += 1;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => runOne())
  );
  return results;
}

async function processRecord(client, endpoint, record, index, skipDetail) {
  const payload = splitRecord(record);

  // Step 1 — create teacher (POST)
  const createResp = await client.post(endpoint, payload);
  const createOk = createResp.status >= 200 && createResp.status < 300;

  const result = {
    index,
    create: {
      ok: createOk,
      status: createResp.status,
      data: createResp.data ?? createResp.statusText,
    },
    detail: null,
  };

  if (!createOk || skipDetail) return result;

  // Step 2 — update with full detail (PUT)
  // Prefer teacher_id from the response body; fall back to what was in the file.
  const teacherId =
    createResp.data?.teacher_id ??
    createResp.data?.data?.teacher_id ??
    payload.teacher_id;

  if (!teacherId) {
    result.detail = { ok: false, error: "teacher_id not returned by POST — cannot PUT detail" };
    return result;
  }

  const detailResp = await client.put(endpoint, { ...payload, teacher_id: teacherId });
  const detailOk = detailResp.status >= 200 && detailResp.status < 300;

  result.detail = {
    ok: detailOk,
    status: detailResp.status,
    data: detailResp.data ?? detailResp.statusText,
  };

  return result;
}

async function main() {
  const raw = await fs.readFile(CONFIG.file, "utf8");
  const parsed = JSON.parse(raw);
  const records = normalizePayload(parsed);

  const endpoint = CONFIG.endpoint.startsWith("/") ? CONFIG.endpoint : `/${CONFIG.endpoint}`;

  const client = axios.create({
    baseURL: CONFIG.baseUrl.replace(/\/+$/, ""),
    timeout: 60_000,
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${CONFIG.token}`,
      "Content-Type": "application/json",
    },
  });

  if (CONFIG.dryRun) {
    const sample = records[0] ? splitRecord(records[0]) : null;
    console.log(JSON.stringify({ count: records.length, baseUrl: client.defaults.baseURL, endpoint, sample }, null, 2));
    return;
  }

  const results = await asyncPool(
    CONFIG.concurrency,
    records,
    (record, i) => processRecord(client, endpoint, record, i, CONFIG.skipDetail)
  );

  const createOk = results.filter((r) => r.create.ok).length;
  const createFail = results.filter((r) => !r.create.ok);
  const detailResults = results.filter((r) => r.detail !== null);
  const detailOk = detailResults.filter((r) => r.detail.ok).length;
  const detailFail = detailResults.filter((r) => !r.detail.ok);

  console.log(
    JSON.stringify(
      {
        total: results.length,
        create: { ok: createOk, failed: createFail.length, failures: createFail.slice(0, 25) },
        detail: CONFIG.skipDetail
          ? "skipped"
          : { ok: detailOk, failed: detailFail.length, failures: detailFail.slice(0, 25) },
      },
      null,
      2
    )
  );

  if (createFail.length || detailFail.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});
