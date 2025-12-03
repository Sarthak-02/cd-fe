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

      // auto refresh list
      await get().fetchSchools();
    } catch (err) {
      set({ error: err });
    }
  },

  // ------------------------
  // UPDATE SCHOOL
  // ------------------------
  updateSchool: async (schoolId, payload) => {
    try {
      await updateSchoolApi(schoolId, payload);

      // refresh list + refresh details
      await Promise.all([
        get().fetchSchools(),
        get().fetchSchoolDetails(schoolId)
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  // ------------------------
  // CLEAR
  // ------------------------
  clearSchoolDetails: () => set({ schoolDetails: null })
}));
