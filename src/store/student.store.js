import { create } from "zustand";
import {
  getAllStudentApi,
  getStudentApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from "../api/student.api";

export const useStudentStore = create((set, get) => ({
  students: [],
  loading: false,
  error: null,

  studentDetails: null,
  loadingStudentDetails: false,

  clearStudentError: () => set({ error: null }),

  fetchStudents: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllStudentApi(campus_id);
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
      await get().fetchStudents(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateStudent: async (payload) => {
    try {
      await updateStudentApi(payload);
      await Promise.all([
        get().fetchStudents(payload.campus_id),
        get().fetchStudentDetails(payload.student_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  deleteStudent: async (student_id, campus_id) => {
    try {
      await deleteStudentApi(student_id);
      await get().fetchStudents(campus_id);
      set({ studentDetails: null });
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearStudentDetails: () => set({ studentDetails: null }),
}));
