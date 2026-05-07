import { create } from "zustand";
import {
  getAllCampusApi,
  getCampusApi,
  createCampusApi,
  updateCampusApi,
  deleteCampusApi,
} from "../api/campus.api";

export const useCampusStore = create((set, get) => ({
  campuses: [],
  loading: false,
  error: null,

  campusDetails: null,
  loadingCampusDetails: false,

  clearCampusError: () => set({ error: null }),

  fetchCampuses: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllCampusApi();
      set({ campuses: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchCampusDetails: async (id) => {
    set({ loadingCampusDetails: true, error: null });
    try {
      const resp = await getCampusApi(id);
      set({ campusDetails: resp.data, loadingCampusDetails: false });
    } catch (err) {
      set({ error: err, loadingCampusDetails: false });
    }
  },

  createCampus: async (payload) => {
    try {
      await createCampusApi(payload);
      await get().fetchCampuses();
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateCampus: async (payload) => {
    try {
      await updateCampusApi(payload);
      await Promise.all([
        get().fetchCampuses(),
        get().fetchCampusDetails(payload.campus_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  deleteCampus: async (campus_id) => {
    try {
      await deleteCampusApi(campus_id);
      await get().fetchCampuses();
      get().clearCampusDetails();
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearCampusDetails: () => set({ campusDetails: null }),
}));
