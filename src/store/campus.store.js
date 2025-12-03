import { create } from "zustand";
import {
  getAllCampusApi,
  getCampusApi,
  createCampusApi,
  updateCampusApi
} from "../api/campus.api";

export const useCampusStore = create((set, get) => ({
  campuses: [],
  loading: false,
  error: null,

  campusDetails: null,
  loadingCampusDetails: false,

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
    }
  },

  updateCampus: async (id, payload) => {
    try {
      await updateCampusApi(id, payload);
      await Promise.all([
        get().fetchCampuses(),
        get().fetchCampusDetails(id)
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  clearCampusDetails: () => set({ campusDetails: null })
}));
