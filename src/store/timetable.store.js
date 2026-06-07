import { create } from "zustand";

const createId = () => Math.random().toString(36).slice(2, 11);

export const useTimetableStore = create((set, get) => ({
  days: [
    { id: "day-1", label: "Monday", order: 1, isActive: true },
    { id: "day-2", label: "Tuesday", order: 2, isActive: true },
    { id: "day-3", label: "Wednesday", order: 3, isActive: true },
    { id: "day-4", label: "Thursday", order: 4, isActive: true },
    { id: "day-5", label: "Friday", order: 5, isActive: true },
    { id: "day-6", label: "Saturday", order: 6, isActive: false },
    { id: "day-7", label: "Sunday", order: 7, isActive: false },
  ],

  slots: [],

  entries: [],

  editorOpen: false,
  editingCell: null,

  addSlot: (slot) =>
    set((state) => ({
      slots: [
        ...state.slots,
        {
          id: createId(),
          label: slot.label || "",
          startTime: slot.startTime || "",
          endTime: slot.endTime || "",
          order: state.slots.length + 1,
          type: slot.type || "class",
        },
      ],
    })),

  updateSlot: (id, updates) =>
    set((state) => ({
      slots: state.slots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      ),
    })),

  removeSlot: (id) =>
    set((state) => ({
      slots: state.slots.filter((slot) => slot.id !== id),
      entries: state.entries.filter((entry) => entry.slotId !== id),
    })),

  openEditor: (cell) =>
    set({
      editorOpen: true,
      editingCell: cell,
    }),

  closeEditor: () =>
    set({
      editorOpen: false,
      editingCell: null,
    }),

  saveEntry: (payload) =>
    set((state) => {
      const { dayId, slotId, ...rest } = payload;
      const existing = state.entries.find(
        (item) => item.dayId === dayId && item.slotId === slotId
      );

      if (existing) {
        return {
          entries: state.entries.map((item) =>
            item.id === existing.id ? { ...item, ...rest } : item
          ),
          editorOpen: false,
          editingCell: null,
        };
      }

      return {
        entries: [
          ...state.entries,
          { id: createId(), dayId, slotId, ...rest },
        ],
        editorOpen: false,
        editingCell: null,
      };
    }),

  clearEntry: ({ dayId, slotId }) =>
    set((state) => ({
      entries: state.entries.filter(
        (item) => !(item.dayId === dayId && item.slotId === slotId)
      ),
      editorOpen: false,
      editingCell: null,
    })),

  getEntry: (dayId, slotId) => {
    const state = get();
    return state.entries.find(
      (item) => item.dayId === dayId && item.slotId === slotId
    );
  },

  toggleDay: (id) =>
    set((state) => ({
      days: state.days.map((d) =>
        d.id === id ? { ...d, isActive: !d.isActive } : d
      ),
    })),

  loadTimetable: (timetableData) => {
    if (!timetableData) return;
    const { days: savedDays, slots, entries } = timetableData;
    set((state) => ({
      days: state.days.map((d) => {
        const saved = (savedDays || []).find((sd) => sd.id === d.id);
        return saved ? { ...d, isActive: saved.isActive } : d;
      }),
      slots: slots || [],
      entries: entries || [],
    }));
  },

  resetTimetable: () =>
    set({
      days: [
        { id: "day-1", label: "Monday", order: 1, isActive: true },
        { id: "day-2", label: "Tuesday", order: 2, isActive: true },
        { id: "day-3", label: "Wednesday", order: 3, isActive: true },
        { id: "day-4", label: "Thursday", order: 4, isActive: true },
        { id: "day-5", label: "Friday", order: 5, isActive: true },
        { id: "day-6", label: "Saturday", order: 6, isActive: false },
        { id: "day-7", label: "Sunday", order: 7, isActive: false },
      ],
      slots: [],
      entries: [],
      editorOpen: false,
      editingCell: null,
    }),
}));