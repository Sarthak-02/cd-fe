import { create } from "zustand";
import {
  getAllSchoolApi,
  getSchoolApi,
  createSchoolApi,
  updateSchoolApi
} from "../api/school.api";

export const useSchoolsStore = create((set, get) => ({
  // LIST
  schools: [],
  loading: false,
  error: null,

  // DETAILS
  schoolDetails: null,
  loadingSchoolDetails: false,

  clearSchoolError: () => set({ error: null }),

  // ------------------------
  // FETCH SCHOOLS (LIST)
  // ------------------------
  fetchSchools: async () => {
    set({ loading: true, error: null });

    try {
      const resp = await getAllSchoolApi();
      set({ schools: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // ------------------------
  // FETCH SPECIFIC SCHOOL DETAILS
  // ------------------------
  fetchSchoolDetails: async (schoolId) => {
    set({ loadingSchoolDetails: true, error: null });

    try {
      const resp = await getSchoolApi(schoolId);
      set({ schoolDetails: resp.data, loadingSchoolDetails: false });
    } catch (err) {
      set({ error: err, loadingSchoolDetails: false });
    }
  },

  // ------------------------
  // CREATE SCHOOL
  // ------------------------
  createSchool: async (payload) => {
    try {
      await createSchoolApi(payload);
      await get().fetchSchools();
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  // ------------------------
  // UPDATE SCHOOL
  // ------------------------
  updateSchool: async (payload) => {
    try {
      await updateSchoolApi(payload);
      await Promise.all([
        get().fetchSchools(),
        get().fetchSchoolDetails(payload.school_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  // ------------------------
  // CLEAR
  // ------------------------
  clearSchoolDetails: () => set({ schoolDetails: null }),
}));
