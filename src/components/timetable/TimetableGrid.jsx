import React from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { sortByOrder } from "../../utils/utility_functions/timetableHelpers";
import TimetableCell from "./TimetableCell";
import { useTranslation } from "react-i18next";

const SLOT_TYPE_HEADER = {
  class:    "bg-blue-50 text-blue-800",
  break:    "bg-amber-50 text-amber-800",
  lunch:    "bg-green-50 text-green-800",
  assembly: "bg-purple-50 text-purple-800",
  elective: "bg-orange-50 text-orange-800",
};

export default function TimetableGrid() {
  const { t } = useTranslation();
  const { days, slots } = useTimetableStore();

  const sortedDays  = sortByOrder(days).filter((d) => d.isActive);
  const sortedSlots = sortByOrder(slots);

  if (sortedSlots.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl border flex flex-col items-center justify-center py-16 text-center text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M10 3v18M14 3v18" />
        </svg>
        <p className="text-sm font-medium">{t("timetable.emptyState.noData")}</p>
        <p className="text-xs mt-1">{t("timetable.emptyState.noSlotsHint")}</p>
      </div>
    );
  }

  if (sortedDays.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl border flex flex-col items-center justify-center py-16 text-center text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">{t("timetable.emptyState.noActiveDays")}</p>
        <p className="text-xs mt-1">{t("timetable.emptyState.noActiveDaysHint")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-white shadow-sm rounded-2xl border">
      <div
        className="grid min-w-[900px]"
        style={{
          gridTemplateColumns: `160px repeat(${sortedSlots.length}, minmax(150px, 1fr))`,
        }}
      >
        {/* Corner cell */}
        <div className="sticky top-0 left-0 z-30 border-b border-r border-gray-200 bg-gray-50 p-3 font-semibold text-sm text-gray-600">
          {t("timetable.fields.daySlot")}
        </div>

        {/* Slot header columns */}
        {sortedSlots.map((slot) => {
          const headerClass = SLOT_TYPE_HEADER[slot.type] || SLOT_TYPE_HEADER.class;
          return (
            <div
              key={slot.id}
              className={`sticky top-0 z-20 border-b border-r border-gray-200 p-3 ${headerClass}`}
            >
              <div className="font-semibold text-sm">
                {slot.label || t("timetable.placeholders.untitledSlot")}
              </div>
              <div className="text-xs capitalize opacity-75 mt-0.5">
                {t(`timetable.slotTypes.${slot.type}`)}
              </div>
            </div>
          );
        })}

        {/* Day rows */}
        {sortedDays.map((day) => (
          <React.Fragment key={day.id}>
            <div className="sticky left-0 z-10 border-b border-r border-gray-200 bg-gray-50 p-3 font-medium text-sm text-gray-900">
              {day.label}
            </div>

            {sortedSlots.map((slot) => (
              <TimetableCell
                key={`${day.id}-${slot.id}`}
                day={day}
                slot={slot}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
