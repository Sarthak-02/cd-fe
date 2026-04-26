import { create } from "zustand";
import {
  getAllTeacherApi,
  getTeacherApi,
  createTeacherApi,
  updateTeacherApi,
  getSectionTeachersApi,
} from "../api/teacher.api";
import { createFullName } from "../utils/utility_functions/updateSchema";

export const useTeacherStore = create((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  sectionTeachers: [],
  loadingSectionTeachers: false,

  teacherDetails: null,
  loadingTeacherDetails: false,

  clearTeacherError: () => set({ error: null }),

  fetchTeachers: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      let resp = await getAllTeacherApi(campus_id);
      resp = resp.data
      const teachers = resp.map((teacher) => ({ ...teacher, fullname: createFullName(teacher.teacher_first_name,teacher.teacher_middle_name,teacher.teacher_last_name)}))

      set({ teachers, loading: false });
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
      await get().fetchTeachers(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateTeacher: async (payload) => {
    try {
      await updateTeacherApi(payload);
      await Promise.all([
        get().fetchTeachers(payload.campus_id),
        get().fetchTeacherDetails(payload.teacher_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearTeacherDetails: () => set({ teacherDetails: null }),

  fetchSectionTeachers: async (section_id, campus_id) => {
    set({ loadingSectionTeachers: true });
    try {
      const resp = await getSectionTeachersApi(section_id, campus_id);
      const list = (resp?.data ?? resp ?? []).map((t) => ({
        ...t,
        fullname: createFullName(
          t.teacher_first_name,
          t.teacher_middle_name,
          t.teacher_last_name
        ),
      }));
      set({ sectionTeachers: list, loadingSectionTeachers: false });
    } catch (err) {
      set({ sectionTeachers: [], loadingSectionTeachers: false });
    }
  },

  clearSectionTeachers: () => set({ sectionTeachers: [] }),
}));
