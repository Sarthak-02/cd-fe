import { create } from "zustand";
import {
  getAllClassApi,
  getClassApi,
  createClassApi,
  updateClassApi,
  deleteClassApi,
} from "../api/class.api";

export const useClassStore = create((set, get) => ({
  classes: [],
  loading: false,
  error: null,

  classDetails: null,
  loadingClassDetails: false,

  clearClassError: () => set({ error: null }),

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
      await get().fetchClasses(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateClass: async (payload) => {
    try {
      await updateClassApi(payload);
      await Promise.all([
        get().fetchClasses(payload.campus_id),
        get().fetchClassDetails(payload.class_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  deleteClass: async (class_id, campus_id) => {
    try {
      await deleteClassApi(class_id);
      await get().fetchClasses(campus_id);
      set({ classDetails: null });
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearClassDetails: () => set({ classDetails: null }),
}));
