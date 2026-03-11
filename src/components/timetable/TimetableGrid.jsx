import React from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { sortByOrder } from "../../utils/utility_functions/timetableHelpers";
import TimetableCell from "./TimetableCell";
import { useTranslation } from "react-i18next";

export default function TimetableGrid() {
  const { t } = useTranslation();
  const { days, slots } = useTimetableStore();

  const sortedDays = sortByOrder(days).filter((day) => day.isActive);
  const sortedSlots = sortByOrder(slots);

  return (
    <div className="overflow-auto bg-white shadow-sm rounded-2xl border">
      <div
        className="grid min-w-[900px]"
        style={{
          gridTemplateColumns: `160px repeat(${sortedSlots.length}, minmax(150px, 1fr))`,
        }}
      >
        <div className="sticky top-0 left-0 z-30 border-b border-r border-gray-200 bg-gray-50 p-3 font-semibold text-gray-900">
          {t("timetable.fields.daySlot")}
        </div>

        {sortedSlots.map((slot) => (
          <div
            key={slot.id}
            className="sticky top-0 z-20 border-b border-r border-gray-200 bg-gray-50 p-3"
          >
            <div className="font-semibold text-gray-900">{slot.label || t("timetable.placeholders.untitledSlot")}</div>
            <div className="text-xs text-gray-500 capitalize">{t(`timetable.slotTypes.${slot.type}`)}</div>
          </div>
        ))}

        {sortedDays.map((day) => (
          <React.Fragment key={day.id}>
            <div className="sticky left-0 z-10 border-b border-r border-gray-200 bg-gray-50 p-3 font-medium text-gray-900">
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