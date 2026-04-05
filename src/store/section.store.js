import { create } from "zustand";
import {
  getAllSectionApi,
  getSectionApi,
  createSectionApi,
  updateSectionApi
} from "../api/section.api";

export const useSectionStore = create((set, get) => ({
  sections: [],
  loading: false,
  error: null,

  sectionDetails: null,
  loadingSectionDetails: false,

  clearSectionError: () => set({ error: null }),

  fetchSections: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllSectionApi(campus_id);
      set({ sections: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchSectionDetails: async (id) => {
    set({ loadingSectionDetails: true, error: null });
    try {
      const resp = await getSectionApi(id);
      set({ sectionDetails: resp.data, loadingSectionDetails: false });
    } catch (err) {
      set({ error: err, loadingSectionDetails: false });
    }
  },

  createSection: async (payload) => {
    try {
      await createSectionApi(payload);
      await get().fetchSections(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateSection: async (payload) => {
    try {
      await updateSectionApi(payload);
      await Promise.all([
        get().fetchSections(payload.campus_id),
        get().fetchSectionDetails(payload.section_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearSectionDetails: () => set({ sectionDetails: null }),
}));
