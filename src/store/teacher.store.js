import { create } from "zustand";
import {
  getAllTeacherApi,
  getTeacherApi,
  createTeacherApi,
  updateTeacherApi
} from "../api/teacher.api";

export const useTeacherStore = create((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  teacherDetails: null,
  loadingTeacherDetails: false,

  fetchTeachers: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await getAllTeacherApi();
      set({ teachers: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchTeacherDetails: async (id) => {
    set({ loadingTeacherDetails: true, error: null });
    try {
      const resp = await getTeacherApi(id);
      set({ teacherDetails: resp.data, loadingTeacherDetails: false });
    } catch (err) {
      set({ error: err, loadingTeacherDetails: false });
    }
  },

  createTeacher: async (payload) => {
    try {
      await createTeacherApi(payload);
      await get().fetchTeachers();
    } catch (err) {
      set({ error: err });
    }
  },

  updateTeacher: async (id, payload) => {
    try {
      await updateTeacherApi(id, payload);
      await Promise.all([
        get().fetchTeachers(),
        get().fetchTeacherDetails(id)
      ]);
    } catch (err) {
      set({ error: err });
    }
  },

  clearTeacherDetails: () => set({ teacherDetails: null })
}));
