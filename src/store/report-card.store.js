import { create } from "zustand";
import { getStudentGradesApi } from "../api/report-card.api";

export const useReportCardStore = create((set) => ({
  reportCards: [],
  generating: false,
  error: null,

  clearError: () => set({ error: null }),
  clearReportCards: () => set({ reportCards: [] }),

  fetchReportCards: async (student_ids) => {
    set({ generating: true, error: null, reportCards: [] });
    try {
      const results = await Promise.all(
        student_ids.map((id) => getStudentGradesApi(id))
      );
      const cards = results.map((r) => r.data).filter(Boolean);
      set({ reportCards: cards, generating: false });
    } catch (err) {
      set({ error: err, generating: false });
      throw err;
    }
  },
}));
