import { create } from "zustand";
import {
  getAllStudentApi,
  getStudentApi,
  createStudentApi,
  updateStudentApi
} from "../api/student.api";

export const useStudentStore = create((set, get) => ({
  students: [],
  loading: false,
  error: null,

  studentDetails: null,
  loadingStudentDetails: false,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllStudentApi();
      set({ students: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchStudentDetails: async (id) => {
    set({ loadingStudentDetails: true, error: null });
    try {
      const resp = await getStudentApi(id);
      set({ studentDetails: resp.data, loadingStudentDetails: false });
    } catch (err) {
      set({ error: err, loadingStudentDetails: false });
    }
  },

  createStudent: async (payload) => {
    try {
      await createStudentApi(payload);
      await get().fetchStudents();
    } catch (err) {
      set({ error: err });
    }
  },

  updateStudent: async (id, payload) => {
    try {
      await updateStudentApi(id, payload);
      await Promise.all([
        get().fetchStudents(),
        get().fetchStudentDetails(id)
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  clearStudentDetails: () => set({ studentDetails: null })
}));
