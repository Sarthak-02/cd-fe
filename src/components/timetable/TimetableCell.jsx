import React from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { useTranslation } from "react-i18next";

export default function TimetableCell({ day, slot }) {
  const { t } = useTranslation();
  const { getEntry, openEditor } = useTimetableStore();
  const entry = getEntry(day.id, slot.id);

  const isSpecial = slot.type === "break" || slot.type === "lunch" || slot.type === "assembly";

  return (
    <button
      onClick={() => openEditor({ dayId: day.id, slotId: slot.id })}
      className={`min-h-[90px] border-b border-r border-gray-200 p-3 text-left transition-all ${
        isSpecial
          ? "bg-gray-50 hover:bg-gray-100"
          : "bg-white hover:bg-blue-50 hover:shadow-sm"
      }`}
    >
      {entry ? (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{entry.subject}</div>
          <div className="text-xs text-gray-600">{entry.teacher}</div>
          <div className="text-xs text-gray-400">{entry.room}</div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          {isSpecial ? (
            <span className="capitalize">{t(`timetable.slotTypes.${slot.type}`)}</span>
          ) : (
            <span className="text-blue-600">+ {t("timetable.buttons.add")}</span>
          )}
        </div>
      )}
    </button>
  );
}