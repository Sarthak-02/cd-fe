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

  createSection: async (payload,campus_id) => {
    try {
      await createSectionApi(payload);
      await get().fetchSections(campus_id);
    } catch (err) {
      set({ error: err });
    }
  },

  updateSection: async (payload,campus_id) => {
    try {
      await updateSectionApi(payload);
      await Promise.all([
        get().fetchSections(campus_id),
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  clearSectionDetails: () => set({ sectionDetails: null })
}));
