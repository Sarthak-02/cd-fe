import { create } from "zustand";
import {
  getAllDashboardConfigsApi,
  getDashboardConfigApi,
  createDashboardConfigApi,
  updateDashboardConfigApi,
  deleteDashboardConfigApi,
} from "../api/report-dashboard.api";

const STATUS_TO_API = { draft: "DRAFT", active: "PUBLISHED", archived: "ARCHIVED" };
const STATUS_FROM_API = { DRAFT: "draft", PUBLISHED: "active", ARCHIVED: "archived" };

function toApiPayload(data, isCreate = false) {
  const payload = {
    name: data.config_name,
    description: data.config_description,
    schoolLevel: data.school_level,
    useGrades: data.use_grades ?? false,
    status: STATUS_TO_API[data.status] ?? "DRAFT",
    enabledClasses: data.enabled_classes ?? [],
    skills: data.skills ?? [],
    ratingScale: data.rating_scale,
    display: data.display,
  };
  if (isCreate) {
    payload.campusId = data.campus_id;
  } else {
    payload.id = data.config_id;
  }
  return payload;
}

function fromApiConfig(data) {
  return {
    config_id: data.id,
    config_name: data.name,
    config_description: data.description ?? "",
    campus_id: data.campusId,
    school_level: data.schoolLevel,
    use_grades: data.useGrades ?? false,
    status: STATUS_FROM_API[data.status] ?? "draft",
    enabled_classes: data.enabledClasses ?? [],
    skills: data.skills ?? [],
    rating_scale: data.ratingScale,
    display: data.display,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
  };
}

export const useReportDashboardStore = create((set, get) => ({
  configs: [],
  loading: false,
  error: null,
  configDetails: null,
  loadingConfigDetails: false,

  clearError: () => set({ error: null }),
  clearConfigDetails: () => set({ configDetails: null }),

  fetchConfigs: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllDashboardConfigsApi(campus_id);
      set({ configs: (resp.data?.data || []).map(fromApiConfig), loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchConfigDetails: async (config_id) => {
    set({ loadingConfigDetails: true, error: null });
    try {
      const resp = await getDashboardConfigApi(config_id);
      set({ configDetails: fromApiConfig(resp.data?.data), loadingConfigDetails: false });
    } catch (err) {
      set({ error: err, loadingConfigDetails: false });
    }
  },

  createConfig: async (payload) => {
    try {
      await createDashboardConfigApi(toApiPayload(payload, true));
      await get().fetchConfigs(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateConfig: async (payload) => {
    try {
      await updateDashboardConfigApi(toApiPayload(payload, false));
      await Promise.all([
        get().fetchConfigs(payload.campus_id),
        get().fetchConfigDetails(payload.config_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  deleteConfig: async (config_id, campus_id) => {
    try {
      await deleteDashboardConfigApi(config_id);
      await get().fetchConfigs(campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },
}));
