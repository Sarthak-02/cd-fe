import api from "./axios";

// payload: { campus_id, tier, features: [{ role, feature_id, enabled?, class_ids? }, ...] }
export async function upsertCampusTierPermissionApi(payload) {
  try {
    const resp = await api.post("/campus-tier-permission", { ...payload });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// payload: { campus_id, tier, features: [{ role, feature_id, enabled?, class_ids? }, ...] }
export async function updateCampusTierPermissionApi(payload) {
  try {
    const resp = await api.put("/campus-tier-permission", { ...payload });
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getCampusTierPermissionApi(campus_id, tier, role) {
  try {
    const resp = await api.get(
      `/campus-tier-permission?campus_id=${encodeURIComponent(campus_id)}&tier=${encodeURIComponent(tier)}&role=${encodeURIComponent(role)}`
    );
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllCampusTierPermissionsApi(campus_id) {
  try {
    const resp = await api.get(
      `/campus-tier-permission/all?campus_id=${encodeURIComponent(campus_id)}`
    );
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteCampusTierPermissionApi(campus_id, tier, role, feature_id) {
  try {
    const resp = await api.delete(
      `/campus-tier-permission?campus_id=${encodeURIComponent(campus_id)}&tier=${encodeURIComponent(tier)}&role=${encodeURIComponent(role)}&feature_id=${encodeURIComponent(feature_id)}`
    );
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
