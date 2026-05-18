import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong.";
}

function StudentRow({ student, checked, onToggle, sectionName }) {
  const initials = [student.student_first_name?.[0], student.student_last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  const fullName = `${student.student_first_name} ${student.student_last_name ?? ""}`.trim();

  return (
    <div
      onClick={onToggle}
      className={`bg-white border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
        checked
          ? "border-blue-300 bg-blue-50 shadow-sm"
          : "border-gray-100 hover:shadow-md hover:border-blue-200"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 accent-blue-600 shrink-0"
      />

      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(student.student_first_name)}`}
      >
        {initials || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{fullName}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
            {student.student_admission_no}
          </span>
          {student.student_roll_no && (
            <span className="text-xs text-gray-400">Roll {student.student_roll_no}</span>
          )}
          {sectionName && (
            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              {sectionName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportCardListing({
  students,
  loading,
  error,
  onRetry,
  onDismissError,
  campuses,
  selectedCampus,
  setSelectedCampus,
  classes,
  sections,
  selectedClass,
  setSelectedClass,
  selectedSection,
  setSelectedSection,
  exams,
  selectedExams,
  setSelectedExams,
  selectedStudentIds,
  setSelectedStudentIds,
  onGenerate,
  generating,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const classOptions = useMemo(
    () => (classes ?? []).map((c) => ({ label: c.class_name, value: c.class_id })),
    [classes]
  );

  const sectionOptions = useMemo(() => {
    const list = sections ?? [];
    const filtered = selectedClass
      ? list.filter((s) => s.class_id === selectedClass)
      : list;
    return filtered.map((s) => ({ label: s.section_name, value: s.section_id }));
  }, [sections, selectedClass]);

  const sectionMap = useMemo(() => {
    const m = {};
    (sections ?? []).forEach((s) => { m[s.section_id] = s.section_name; });
    return m;
  }, [sections]);

  const filteredStudents = useMemo(() => {
    let list = students ?? [];

    if (selectedSection) {
      list = list.filter((s) => s.student_section_id === selectedSection);
    } else if (selectedClass) {
      const sectionIds = new Set(
        (sections ?? [])
          .filter((s) => s.class_id === selectedClass)
          .map((s) => s.section_id)
      );
      list = list.filter((s) => sectionIds.has(s.student_section_id));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        ({ student_first_name, student_last_name, student_admission_no }) =>
          `${student_first_name} ${student_last_name ?? ""}`.toLowerCase().includes(q) ||
          student_admission_no?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [students, selectedSection, selectedClass, sections, search]);

  const allFilteredIds = filteredStudents.map((s) => s.student_id);
  const allSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedStudentIds.includes(id));
  const someSelected = selectedStudentIds.length > 0;

  function toggleStudent(student_id) {
    setSelectedStudentIds((prev) =>
      prev.includes(student_id)
        ? prev.filter((id) => id !== student_id)
        : [...prev, student_id]
    );
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      setSelectedStudentIds((prev) => [
        ...new Set([...prev, ...allFilteredIds]),
      ]);
    }
  }

  const showSkeleton = Boolean(selectedCampus && loading);

  return (
    <>
      {error && (
        <div
          className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{apiErrorMessage(error)}</span>
          </div>
          <div className="flex gap-3 shrink-0">
            {onRetry && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onRetry}>
                {t("common.retry")}
              </button>
            )}
            {onDismissError && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onDismissError}>
                {t("common.dismiss")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters — row 1: campus, class, section, exam */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <div className="sm:w-44 shrink-0">
          <Dropdown
            options={campuses}
            selected={selectedCampus}
            onChange={(val) => {
              setSelectedCampus(val);
              setSelectedClass("");
              setSelectedSection("");
              setSelectedExams([]);
              setSelectedStudentIds([]);
            }}
            placeholder={t("reportCard.listing.placeholders.campus")}
          />
        </div>
        <div className="sm:w-40 shrink-0">
          <Dropdown
            options={classOptions}
            selected={selectedClass}
            onChange={(val) => {
              setSelectedClass(val);
              setSelectedSection("");
              setSelectedStudentIds([]);
            }}
            placeholder={t("reportCard.listing.placeholders.class")}
          />
        </div>
        <div className="sm:w-40 shrink-0">
          <Dropdown
            options={sectionOptions}
            selected={selectedSection}
            onChange={(val) => {
              setSelectedSection(val);
              setSelectedStudentIds([]);
            }}
            placeholder={t("reportCard.listing.placeholders.section")}
          />
        </div>
        <div className="sm:w-48 shrink-0">
          <Dropdown
            options={exams}
            selected={selectedExams}
            onChange={(val) => {
              setSelectedExams(val);
              setSelectedStudentIds([]);
            }}
            placeholder={t("reportCard.listing.placeholders.exam")}
            multi={true}
          />
        </div>
        <div className="flex-1 min-w-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t("reportCard.listing.searchPlaceholder")}
          />
        </div>
      </div>

      {/* Exam required hint */}
      {selectedCampus && !selectedExams?.length && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
          {t("reportCard.listing.selectExamHint")}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">{t("reportCard.listing.selectCampusTitle")}</p>
          <p className="text-sm text-gray-400 mt-1">{t("reportCard.listing.selectCampusSubtitle")}</p>
        </div>
      )}

      {/* Selection bar + generate button */}
      {selectedCampus && !loading && filteredStudents.length > 0 && (
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {allSelected ? t("reportCard.listing.deselectAll") : t("reportCard.listing.selectAll")}
            </button>
            {someSelected && (
              <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-0.5 rounded-full">
                {t("reportCard.listing.selected", { count: selectedStudentIds.length })}
              </span>
            )}
            {!someSelected && (
              <span className="text-xs text-gray-400">
                {t("reportCard.listing.studentCount", { count: filteredStudents.length })}
              </span>
            )}
          </div>
          <Button
            onClick={onGenerate}
            disabled={!someSelected || !selectedExams?.length || generating}
          >
            {generating
              ? t("reportCard.listing.generating")
              : t("reportCard.listing.generate", { count: selectedStudentIds.length })}
          </Button>
        </div>
      )}

      {/* Empty — no students in campus */}
      {selectedCampus && !loading && (students ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">{t("reportCard.listing.noStudentsTitle")}</p>
        </div>
      )}

      {/* No search / filter results */}
      {selectedCampus && !loading && (students ?? []).length > 0 && filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">{t("reportCard.listing.noMatchesTitle")}</p>
          <p className="text-sm text-gray-400 mt-1">{t("reportCard.listing.noMatchesSubtitle")}</p>
        </div>
      )}

      {/* Student list */}
      <div className="flex flex-col gap-2">
        {showSkeleton
          ? [...Array(8)].map((_, i) => <CardSkeleton key={i} />)
          : filteredStudents.map((student) => (
              <StudentRow
                key={student.student_id}
                student={student}
                checked={selectedStudentIds.includes(student.student_id)}
                onToggle={() => toggleStudent(student.student_id)}
                sectionName={sectionMap[student.student_section_id]}
              />
            ))}
      </div>
    </>
  );
}
