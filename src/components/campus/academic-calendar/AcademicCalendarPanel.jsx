import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAcademicCalendarStore } from "../../../store/academic-calendar.store";
import Button from "../../../ui-components/Button";
import CalendarYearView from "./CalendarYearView";
import EventList from "./EventList";
import AddEditEventDialog from "./AddEditEventDialog";

const VIEWS = { CALENDAR: "calendar", LIST: "list" };

export default function AcademicCalendarPanel({ campusExtras, onSave }) {
  const { t } = useTranslation();
  const [view, setView] = useState(VIEWS.CALENDAR);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { events, yearConfig, loadFromCampus, setYearConfig } =
    useAcademicCalendarStore();

  useEffect(() => {
    loadFromCampus(campusExtras);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddEvent() {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  }

  function openEditEvent(event) {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }

  function handleSave() {
    const calendarData = useAcademicCalendarStore.getState().getCalendarData();
    onSave(calendarData);
  }

  return (
    <div className="space-y-5 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("academicCalendar.title")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("academicCalendar.subtitle")}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={openAddEvent}>
            + {t("academicCalendar.buttons.addEvent")}
          </Button>
          <Button size="sm" onClick={handleSave}>
            {t("academicCalendar.buttons.save")}
          </Button>
        </div>
      </div>

      {/* Year configuration strip */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            {t("academicCalendar.fields.academicYear")}
          </label>
          <input
            type="text"
            value={yearConfig.year}
            onChange={(e) => setYearConfig({ year: e.target.value })}
            placeholder="2025-26"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            {t("academicCalendar.fields.startDate")}
          </label>
          <input
            type="date"
            value={yearConfig.start_date}
            onChange={(e) => setYearConfig({ start_date: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            {t("academicCalendar.fields.endDate")}
          </label>
          <input
            type="date"
            value={yearConfig.end_date}
            onChange={(e) => setYearConfig({ end_date: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <span className="text-xs text-gray-500">
            {events.length}{" "}
            {events.length === 1
              ? t("academicCalendar.eventCount.one")
              : t("academicCalendar.eventCount.many")}
          </span>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setView(VIEWS.CALENDAR)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            view === VIEWS.CALENDAR
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("academicCalendar.views.calendar")}
        </button>
        <button
          type="button"
          onClick={() => setView(VIEWS.LIST)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            view === VIEWS.LIST
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("academicCalendar.views.list")}
        </button>
      </div>

      {/* Active view */}
      {view === VIEWS.CALENDAR && (
        <CalendarYearView
          events={events}
          yearConfig={yearConfig}
          onEventClick={openEditEvent}
        />
      )}
      {view === VIEWS.LIST && (
        <EventList events={events} onEdit={openEditEvent} />
      )}

      {/* Add / Edit dialog */}
      <AddEditEventDialog
        open={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
