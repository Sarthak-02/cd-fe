import { create } from "zustand";
import {
  getAllClassApi,
  getClassApi,
  createClassApi,
  updateClassApi
} from "../api/class.api";

export const useClassStore = create((set, get) => ({
  classes: [],
  loading: false,
  error: null,

  classDetails: null,
  loadingClassDetails: false,

  fetchClasses: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllClassApi(campus_id);
      set({ classes: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchClassDetails: async (id) => {
    set({ loadingClassDetails: true, error: null });
    try {
      const resp = await getClassApi(id);
      set({ classDetails: resp.data, loadingClassDetails: false });
    } catch (err) {
      set({ error: err, loadingClassDetails: false });
    }
  },

  createClass: async (payload) => {
    try {
      await createClassApi(payload);
      await get().fetchClasses();
    } catch (err) {
      set({ error: err });
    }
  },

  updateClass: async (id, payload) => {
    try {
      await updateClassApi(id, payload);
      await Promise.all([
        get().fetchClasses(),
        get().fetchClassDetails(id)
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  clearClassDetails: () => set({ classDetails: null })
}));
