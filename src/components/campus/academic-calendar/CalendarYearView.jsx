import React from "react";
import { useTranslation } from "react-i18next";
import { getEventTypeColor } from "../../../store/academic-calendar.store";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getEventsForDay(events, year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return events.filter((ev) => ev.start_date <= dateStr && ev.end_date >= dateStr);
}

function MonthCard({ year, month, events, onEventClick }) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Build cell array: nulls for leading empty slots, then day numbers
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 text-center uppercase tracking-wide">
        {MONTH_NAMES[month]} {year}
      </h3>

      <div className="grid grid-cols-7 gap-0">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-gray-400 font-medium py-0.5"
          >
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;

          const dayEvents = getEventsForDay(events, year, month, day);
          const isToday = isCurrentMonth && today.getDate() === day;

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <span
                className={`text-[11px] w-5 h-5 flex items-center justify-center rounded-full leading-none ${
                  isToday
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700"
                }`}
              >
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-px flex-wrap justify-center mt-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onEventClick(ev)}
                      className="w-1.5 h-1.5 rounded-full hover:scale-150 transition-transform"
                      style={{ backgroundColor: getEventTypeColor(ev.type) }}
                      title={ev.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] text-gray-400 leading-none">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarYearView({ events, yearConfig, onEventClick }) {
  const { t } = useTranslation();

  const startDate = yearConfig.start_date
    ? new Date(yearConfig.start_date)
    : new Date(new Date().getFullYear(), 0, 1);
  const endDate = yearConfig.end_date
    ? new Date(yearConfig.end_date)
    : new Date(new Date().getFullYear(), 11, 31);

  // Build ordered list of {year, month} to render
  const monthsList = [];
  let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endBound = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  while (cur <= endBound && monthsList.length < 24) {
    monthsList.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur.setMonth(cur.getMonth() + 1);
  }

  // Collect distinct event types present in data for the legend
  const presentTypes = [...new Set(events.map((e) => e.type))];

  return (
    <div className="space-y-4">
      {/* Legend */}
      {presentTypes.length > 0 && (
        <div className="flex flex-wrap gap-3 px-1">
          {presentTypes.map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getEventTypeColor(type) }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {t(`academicCalendar.eventTypes.${type}`)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Month grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monthsList.map(({ year, month }) => (
          <MonthCard
            key={`${year}-${month}`}
            year={year}
            month={month}
            events={events}
            onEventClick={onEventClick}
          />
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          {t("academicCalendar.emptyCalendar")}
        </p>
      )}
    </div>
  );
}
