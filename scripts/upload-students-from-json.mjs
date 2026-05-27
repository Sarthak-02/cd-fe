import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Matches `createPayload` in AddEditStudent — API expects `student_admission_no`. */
function randomAdmissionNo() {
  const ts = Date.now().toString(36);
  const rnd = randomBytes(4).toString("hex");
  return `ADM-${ts}-${rnd}`;
}


function splitRecord(record) {
  const {
    student_admission_no,
    student_roll_no,
    student_first_name,
    student_middle_name,
    student_last_name,
    student_gender,
    student_dob,
    student_current_status,
    campus_id = "test",
    student_section_id,
    ...extras
  } = record;

  return {
    student_admission_no,
    student_roll_no,
    student_first_name,
    student_middle_name,
    student_last_name,
    student_gender,
    student_dob: student_dob ? new Date(student_dob).toISOString() : null,
    student_current_status,
    campus_id,
    student_section_id,
    extras,
  };
}

const CONFIG = {
  file: path.join(__dirname, "students-sample.json"),
  baseUrl: "http://127.0.0.1:5000",
  endpoint: "/onboarding/student",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJzYXJ0aGFrIiwiaWF0IjoxNzc5ODk3MzQzLCJleHAiOjE3Nzk5ODM3NDN9.QO2pCep0VHnbOhDfTBn36ofBp_QYkwgAJB4U0kObAxU",
  concurrency: 1,
  dryRun: false,
  randomAdmission: false,
};

function normalizePayload(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.students)) return json.students;
    return [json];
  }
  throw new Error("Unsupported JSON format. Provide an array or an object.");
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

  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    runOne()
  );
  await Promise.all(runners);
  return results;
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

  const results = await asyncPool(CONFIG.concurrency, records, async (record, i) => {
    const split = splitRecord(record);
    const payload = CONFIG.randomAdmission ? { ...split, student_admission_no: randomAdmissionNo() } : split;
    const resp = await client.post(endpoint, payload);
    const ok = resp.status >= 200 && resp.status < 300;
    return {
      index: i,
      ok,
      status: resp.status,
      data: ok ? resp.data : resp.data ?? resp.statusText,
    };
  });

  const okCount = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);

  console.log(
    JSON.stringify({ total: results.length, ok: okCount, failed: fail.length, failures: fail.slice(0, 25) }, null, 2)
  );

  if (fail.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});

