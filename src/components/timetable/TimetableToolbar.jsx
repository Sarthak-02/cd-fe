import React from "react";
import { useTimetableStore } from "../../store/timetable.store";
import Dropdown from "../../ui-components/Dropdown";
import { useTranslation } from "react-i18next";

export default function TimetableToolbar() {
  const { t } = useTranslation();
  const { selectedClassId, selectedSectionId, setSelectedContext } =
    useTimetableStore();

  const classOptions = [
    { label: t("timetable.classes.grade1"), value: "class-1" },
    { label: t("timetable.classes.grade2"), value: "class-2" },
    { label: t("timetable.classes.grade3"), value: "class-3" },
  ];

  const sectionOptions = [
    { label: t("timetable.sections.a"), value: "section-a" },
    { label: t("timetable.sections.b"), value: "section-b" },
    { label: t("timetable.sections.c"), value: "section-c" },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white shadow-sm rounded-2xl border p-4 md:flex-row">
      <div className="flex-1">
        <Dropdown
          label={t("timetable.fields.class")}
          options={classOptions}
          selected={selectedClassId}
          onChange={(value) => setSelectedContext({ classId: value })}
        />
      </div>

      <div className="flex-1">
        <Dropdown
          label={t("timetable.fields.section")}
          options={sectionOptions}
          selected={selectedSectionId}
          onChange={(value) => setSelectedContext({ sectionId: value })}
        />
      </div>
    </div>
  );
}