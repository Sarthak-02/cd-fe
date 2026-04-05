import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
import axios from "axios";

/** Matches `createPayload` in AddEditStudent — API expects `student_admission_no`. */
function randomAdmissionNo() {
  const ts = Date.now().toString(36);
  const rnd = randomBytes(4).toString("hex");
  return `ADM-${ts}-${rnd}`;
}

/** Shallow clone: overwrite admission number so each POST gets a unique value. */
function withRandomAdmissionNo(record) {
  return {
    ...record,
    student_admission_no: randomAdmissionNo(),
  };
}

function parseArgs(argv) {
  const args = {
    file: null,
    baseUrl: "http://127.0.0.1:5000",
    endpoint:  "/onboarding/student",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJzYXJ0aGFrIiwiaWF0IjoxNzc0OTYyNjgyLCJleHAiOjE3NzUwNDkwODJ9.kyya7Fb_1EqBKkdgTk88IM7BKztMUJ9TEt8mpaCso1A",
    cookie: process.env.COOKIE || "",
    concurrency: Number(process.env.CONCURRENCY || "1"),
    dryRun: false,
    randomAdmission: true,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a) continue;

    if (a === "--file" || a === "-f") args.file = argv[i + 1];
    else if (a === "--base-url") args.baseUrl = argv[i + 1] || "";
    else if (a === "--endpoint") args.endpoint = argv[i + 1] || args.endpoint;
    else if (a === "--token") args.token = argv[i + 1] || "";
    else if (a === "--cookie") args.cookie = argv[i + 1] || "";
    else if (a === "--concurrency" || a === "-c")
      args.concurrency = Number(argv[i + 1] || "1");
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--keep-admission-from-file") args.randomAdmission = false;
  }

  if (!args.file) {
    throw new Error(
      "Missing --file. Usage: node scripts/upload-students-from-json.mjs --file ./students.json --base-url https://api.example.com"
    );
  }
  if (!args.baseUrl) {
    throw new Error(
      "Missing --base-url (or BASE_URL env). Example: --base-url https://api.example.com"
    );
  }
  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) {
    args.concurrency = 1;
  }

  return args;
}

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
  const args = parseArgs(process.argv);

  const raw = await fs.readFile(args.file, "utf8");
  const parsed = JSON.parse(raw);
  const records = normalizePayload(parsed);

  const client = axios.create({
    baseURL: args.baseUrl.replace(/\/+$/, ""),
    timeout: 60_000,
    validateStatus: () => true,
    headers: {
      ...(args.token ? { Authorization: `Bearer ${args.token}` } : {}),
      ...(args.cookie ? { Cookie: args.cookie } : {}),
      "Content-Type": "application/json",
    },
  });

  if (args.dryRun) {
    const sample = records[0]
      ? args.randomAdmission
        ? withRandomAdmissionNo(records[0])
        : records[0]
      : null;
    console.log(
      JSON.stringify(
        {
          count: records.length,
          baseUrl: client.defaults.baseURL,
          endpoint: args.endpoint,
          randomAdmission: args.randomAdmission,
          sample,
        },
        null,
        2
      )
    );
    return;
  }

  const endpoint =
    args.endpoint.startsWith("/") ? args.endpoint : `/${args.endpoint}`;

  const results = await asyncPool(args.concurrency, records, async (record, i) => {
    const payload = args.randomAdmission
      ? withRandomAdmissionNo(record)
      : record;
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
    JSON.stringify(
      {
        total: results.length,
        ok: okCount,
        failed: fail.length,
        failures: fail.slice(0, 25),
      },
      null,
      2
    )
  );

  if (fail.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});

