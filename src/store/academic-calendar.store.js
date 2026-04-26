import { create } from "zustand";

export const EVENT_TYPES = [
  { value: "exam", label: "Exam", color: "#EF4444" },
  { value: "holiday", label: "Holiday", color: "#22C55E" },
  { value: "sports", label: "Sports", color: "#F97316" },
  { value: "cultural", label: "Cultural", color: "#A855F7" },
  { value: "meeting", label: "Meeting", color: "#3B82F6" },
  { value: "other", label: "Other", color: "#6B7280" },
];

export function getEventTypeColor(type) {
  return EVENT_TYPES.find((t) => t.value === type)?.color ?? "#6B7280";
}

function generateId() {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const currentYear = new Date().getFullYear();

const DEFAULT_YEAR_CONFIG = {
  year: `${currentYear}-${String(currentYear + 1).slice(2)}`,
  start_date: `${currentYear}-04-01`,
  end_date: `${currentYear + 1}-03-31`,
};

export const useAcademicCalendarStore = create((set, get) => ({
  events: [],
  yearConfig: { ...DEFAULT_YEAR_CONFIG },

  loadFromCampus: (campusExtras) => {
    const cal = campusExtras?.academic_calendar;
    if (cal) {
      set({
        events: cal.events ?? [],
        yearConfig: {
          year: cal.year ?? DEFAULT_YEAR_CONFIG.year,
          start_date: cal.start_date ?? DEFAULT_YEAR_CONFIG.start_date,
          end_date: cal.end_date ?? DEFAULT_YEAR_CONFIG.end_date,
        },
      });
    } else {
      set({ events: [], yearConfig: { ...DEFAULT_YEAR_CONFIG } });
    }
  },

  setYearConfig: (config) =>
    set((state) => ({ yearConfig: { ...state.yearConfig, ...config } })),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, { ...event, id: generateId() }],
    })),

  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((ev) =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      ),
    })),

  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((ev) => ev.id !== id) })),

  getCalendarData: () => {
    const { events, yearConfig } = get();
    return { ...yearConfig, events };
  },
}));
