import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAcademicCalendarStore,
  getEventTypeColor,
} from "../../../store/academic-calendar.store";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EventList({ events, onEdit }) {
  const { t } = useTranslation();
  const { deleteEvent } = useAcademicCalendarStore();
  const [filter, setFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const types = ["all", ...new Set(events.map((e) => e.type))];

  const filtered = [...events]
    .filter((ev) => filter === "all" || ev.type === filter)
    .sort((a, b) => (a.start_date > b.start_date ? 1 : -1));

  function handleDelete(id) {
    if (deleteConfirmId === id) {
      deleteEvent(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  }

  return (
    <div className="space-y-4">
      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const count =
            type === "all"
              ? events.length
              : events.filter((e) => e.type === type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                filter === type
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {type === "all"
                ? t("academicCalendar.filters.all")
                : t(`academicCalendar.eventTypes.${type}`)}
              <span
                className={`${filter === type ? "text-gray-400" : "text-gray-400"}`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">
          {events.length === 0
            ? t("academicCalendar.emptyCalendar")
            : t("academicCalendar.noMatchingEvents")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("academicCalendar.table.title")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("academicCalendar.table.type")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("academicCalendar.table.startDate")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("academicCalendar.table.endDate")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  {t("academicCalendar.table.description")}
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  {t("academicCalendar.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ev) => (
                <tr
                  key={ev.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {ev.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap"
                      style={{ backgroundColor: getEventTypeColor(ev.type) }}
                    >
                      {t(`academicCalendar.eventTypes.${ev.type}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(ev.start_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(ev.end_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate hidden md:table-cell">
                    {ev.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(ev)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t("academicCalendar.buttons.edit")}
                      </button>
                      {deleteConfirmId === ev.id ? (
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(ev.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold"
                          >
                            {t("academicCalendar.buttons.confirmDelete")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            {t("academicCalendar.buttons.cancel")}
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(ev.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          {t("academicCalendar.buttons.delete")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
