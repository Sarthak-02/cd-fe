import React from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { useTranslation } from "react-i18next";

const SLOT_TYPE_CELL = {
  class:    { base: "bg-white hover:bg-blue-50",           special: false },
  break:    { base: "bg-amber-50 hover:bg-amber-100",      special: true  },
  lunch:    { base: "bg-green-50 hover:bg-green-100",      special: true  },
  assembly: { base: "bg-purple-50 hover:bg-purple-100",    special: true  },
  elective: { base: "bg-white hover:bg-orange-50",         special: false },
};

const SLOT_TYPE_ACCENT = {
  class:    "bg-blue-500",
  break:    "bg-amber-500",
  lunch:    "bg-green-500",
  assembly: "bg-purple-500",
  elective: "bg-orange-500",
};

export default function TimetableCell({ day, slot }) {
  const { t } = useTranslation();
  const { getEntry, openEditor } = useTimetableStore();
  const entry = getEntry(day.id, slot.id);

  const cellStyle = SLOT_TYPE_CELL[slot.type] || SLOT_TYPE_CELL.class;
  const accent    = SLOT_TYPE_ACCENT[slot.type] || SLOT_TYPE_ACCENT.class;

  return (
    <button
      onClick={() => openEditor({ dayId: day.id, slotId: slot.id })}
      className={`min-h-[90px] border-b border-r border-gray-200 p-3 text-left transition-all ${cellStyle.base} group`}
    >
      {entry ? (
        <div className="space-y-1 relative">
          <div className={`w-1 h-full absolute left-0 top-0 ${accent} rounded-l`} />
          {entry.isElective ? (
            <>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide pl-1">
                {t("timetable.slotTypes.elective")}
              </div>
              {(entry.electives || []).map((el, i) => (
                <div key={i} className="bg-orange-50 border border-orange-100 rounded px-1.5 py-0.5">
                  <div className="text-xs font-medium text-gray-800 leading-tight">{el.subject}</div>
                  {el.teacher && (
                    <div className="text-xs text-gray-500 leading-tight">{el.teacher}</div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="font-semibold text-sm text-gray-900 leading-tight">{entry.subject}</div>
              {entry.teacher && (
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {entry.teacher}
                </div>
              )}
              {entry.room && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {entry.room}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[66px]">
          {cellStyle.special ? (
            <span className="text-xs text-gray-400 capitalize font-medium">
              {t(`timetable.slotTypes.${slot.type}`)}
            </span>
          ) : (
            <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              + {t("timetable.buttons.add")}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
