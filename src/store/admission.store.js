import { create } from "zustand";
import {
  getAllAdmissionsApi,
  getAdmissionApi,
  createAdmissionApi,
  updateAdmissionApi,
  deleteAdmissionApi,
  enrollAdmissionApi,
  normalizeAdmissionRecord,
  normalizeAdmissionListResponse,
} from "../api/admission.api";

export const useAdmissionStore = create((set, get) => ({
  admissions: [],
  loading: false,
  error: null,

  admissionDetails: null,
  loadingAdmissionDetails: false,

  clearAdmissionError: () => set({ error: null }),
  clearAdmissionDetails: () => set({ admissionDetails: null }),

  fetchAdmissions: async (campus_id) => {
    set({ loading: true, error: null });
    try {
      const body = await getAllAdmissionsApi(campus_id);
      set({ admissions: normalizeAdmissionListResponse(body), loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  fetchAdmissionDetails: async (id) => {
    set({ loadingAdmissionDetails: true, error: null });
    try {
      const body = await getAdmissionApi(id);
      const raw = body?.data !== undefined ? body.data : body;
      set({
        admissionDetails:
          raw && typeof raw === "object" ? normalizeAdmissionRecord(raw) : null,
        loadingAdmissionDetails: false,
      });
    } catch (err) {
      set({ error: err, loadingAdmissionDetails: false });
    }
  },

  createAdmission: async (payload) => {
    try {
      await createAdmissionApi(payload);
      await get().fetchAdmissions(payload.campus_id);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  updateAdmission: async (payload) => {
    try {
      await updateAdmissionApi(payload);
      await Promise.all([
        get().fetchAdmissions(payload.campus_id),
        get().fetchAdmissionDetails(payload.admission_id),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  deleteAdmission: async (admission_id, campus_id) => {
    try {
      await deleteAdmissionApi(admission_id);
      await get().fetchAdmissions(campus_id);
      set({ admissionDetails: null });
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  convertToStudent: async (admission_id, campus_id) => {
    try {
      const result = await enrollAdmissionApi(admission_id);
      await get().fetchAdmissions(campus_id);
      return result;
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },
}));
