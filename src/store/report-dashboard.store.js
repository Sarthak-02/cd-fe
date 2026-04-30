import { create } from "zustand";
import {
  getAllDashboardConfigsApi,
  getDashboardConfigApi,
  createDashboardConfigApi,
  updateDashboardConfigApi,
  deleteDashboardConfigApi,
} from "../api/report-dashboard.api";

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
      set({ configs: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchConfigDetails: async (config_id) => {
    set({ loadingConfigDetails: true, error: null });
    try {
      const resp = await getDashboardConfigApi(config_id);
      set({ configDetails: resp.data, loadingConfigDetails: false });
    } catch (err) {
      set({ error: err, loadingConfigDetails: false });
    }
  },

  createConfig: async (payload) => {
    try {
      await createDashboardConfigApi(payload);
      await get().fetchConfigs(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateConfig: async (payload) => {
    try {
      await updateDashboardConfigApi(payload);
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
