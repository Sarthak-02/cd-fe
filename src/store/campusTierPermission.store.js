import { create } from "zustand";
import {
  getAllCampusTierPermissionsApi,
  upsertCampusTierPermissionApi,
  deleteCampusTierPermissionApi,
} from "../api/campusTierPermission.api";

// Shape of permissionsByCampus (flat per tier — feature_ids are unique across roles):
// {
//   [campus_id]: {
//     [tier]: {
//       [feature_id]: { enabled: boolean, class_ids: string[] }
//     }
//   }
// }
export const useCampusTierPermissionStore = create((set, get) => ({
  permissionsByCampus: {},
  loading: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchAllForCampus: async (campus_id) => {
    if (!campus_id) return null;
    set({ loading: true, error: null });
    try {
      const resp = await getAllCampusTierPermissionsApi(campus_id);
      const records = Array.isArray(resp?.data) ? resp.data : [];
      const tierMap = {};
      records.forEach((r) => {
        if (!r?.tier || !r?.feature_id) return;
        if (!tierMap[r.tier]) tierMap[r.tier] = {};
        tierMap[r.tier][r.feature_id] = {
          enabled: !!r.enabled,
          class_ids: Array.isArray(r.class_ids) ? r.class_ids : [],
        };
      });
      set((s) => ({
        permissionsByCampus: {
          ...s.permissionsByCampus,
          [campus_id]: tierMap,
        },
        loading: false,
      }));
      return tierMap;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  // Bulk-upsert permissions for a (campus, tier) in a single request.
  // features = [{ role, feature_id, enabled, class_ids }, ...]
  saveTierPermissions: async (campus_id, tier, features) => {
    if (!campus_id || !tier || !Array.isArray(features) || features.length === 0) {
      return;
    }
    set({ saving: true, error: null });
    try {
      const normalized = features.map((f) => ({
        role: f.role,
        feature_id: f.feature_id,
        enabled: !!f.enabled,
        class_ids: Array.isArray(f.class_ids) ? f.class_ids : [],
      }));

      await upsertCampusTierPermissionApi({
        campus_id,
        tier,
        features: normalized,
      });

      const tierUpdate = {};
      normalized.forEach((f) => {
        tierUpdate[f.feature_id] = {
          enabled: f.enabled,
          class_ids: f.class_ids,
        };
      });

      set((s) => {
        const campusMap = s.permissionsByCampus[campus_id] ?? {};
        return {
          saving: false,
          permissionsByCampus: {
            ...s.permissionsByCampus,
            [campus_id]: {
              ...campusMap,
              [tier]: { ...(campusMap[tier] ?? {}), ...tierUpdate },
            },
          },
        };
      });
    } catch (err) {
      set({ error: err, saving: false });
      throw err;
    }
  },

  deleteTierPermission: async (campus_id, tier, role, feature_id) => {
    try {
      await deleteCampusTierPermissionApi(campus_id, tier, role, feature_id);
      set((s) => {
        const campusMap = { ...(s.permissionsByCampus[campus_id] ?? {}) };
        const tierMap = { ...(campusMap[tier] ?? {}) };
        delete tierMap[feature_id];
        campusMap[tier] = tierMap;
        return {
          permissionsByCampus: {
            ...s.permissionsByCampus,
            [campus_id]: campusMap,
          },
        };
      });
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearCampusPermissions: (campus_id) =>
    set((s) => {
      if (!campus_id) return {};
      const next = { ...s.permissionsByCampus };
      delete next[campus_id];
      return { permissionsByCampus: next };
    }),
}));
