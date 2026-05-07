import api from "./axios";

/** Flattens `extras` onto the record for forms and listing (matches API body shape). */
export function normalizeAdmissionRecord(record) {
  if (!record || typeof record !== "object") return record;
  const { extras, ...top } = record;
  return {
    ...top,
    ...(extras && typeof extras === "object" ? extras : {}),
  };
}

function admissionsArrayFromResponse(body) {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  return [];
}

/** Query: optional `campus_id` (admissionByCampusGetRequestSchema). */
export async function getAllAdmissionsApi(campus_id) {
  try {
    const params = {};
    if (campus_id) params.campus_id = campus_id;
    const resp = await api.get("/admission/all", { params });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function normalizeAdmissionListResponse(body) {
  return admissionsArrayFromResponse(body).map(normalizeAdmissionRecord);
}

/** Query: required `admission_id` (admissionGetRequestSchema). */
export async function getAdmissionApi(admission_id) {
  try {
    const resp = await api.get("/admission", {
      params: { admission_id },
    });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function createAdmissionApi(data) {
  try {
    const resp = await api.post("/admission", { ...data });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateAdmissionApi(data) {
  try {
    const resp = await api.put("/admission", { ...data });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteAdmissionApi(admission_id) {
  try {
    const resp = await api.delete("/admission", {
      params: { admission_id },
    });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/** Body: `{ admission_id }` (admissionEnrollRequestSchema). */
export async function enrollAdmissionApi(admission_id) {
  try {
    const resp = await api.post("/admission/enroll", { admission_id });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/** @deprecated Use enrollAdmissionApi */
export async function convertAdmissionToStudentApi(admission_id) {
  return enrollAdmissionApi(admission_id);
}
