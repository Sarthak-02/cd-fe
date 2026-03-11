import React from "react";
import TimetableToolbar from "../components/timetable/TimetableToolbar";
import TimetableConfigPanel from "../components/timetable/TimetableConfigPanel";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableCellEditor from "../components/timetable/TimetableCellEditor";
import { useTranslation } from "react-i18next";

export default function Timetable() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("timetable.title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("timetable.subtitle")}
          </p>
        </div>

        {/* <TimetableToolbar /> */}
        <TimetableConfigPanel />
        <TimetableGrid />
        <TimetableCellEditor />
      </div>
    </div>
  );
}