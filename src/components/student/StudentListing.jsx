import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";

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

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
};

function StudentCard({ student, onClick }) {
  const initials = [student.student_first_name?.[0], student.student_last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  const fullName = `${student.student_first_name} ${student.student_last_name ?? ""}`.trim();
  const status = student.student_current_status?.toLowerCase();
  const rollNo = student.student_roll_no;
  const fatherName = student.student_father_name || student.extras?.student_father_name;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${avatarColor(student.student_first_name)}`}
      >
        {initials || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
            {fullName}
          </p>
          {status && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}>
              {status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md shrink-0">
            {student.student_admission_no}
          </span>
          {rollNo && (
            <span className="text-xs text-gray-400 shrink-0">Roll {rollNo}</span>
          )}
        </div>
        {fatherName && (
          <p className="text-xs text-gray-400 mt-1 truncate">S/O {fatherName}</p>
        )}
      </div>

      <svg
        className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors self-center"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Could not load students.";
}

export default function StudentListing({
  handleCreate,
  students,
  handleSelectStudent,
  campuses,
  selectedCampus,
  setSelectedCampus,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const [search, setSearch] = useState("");

  const allStudents = students ?? [];

  const list = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allStudents;
    return allStudents.filter(
      ({ student_first_name, student_last_name, student_admission_no }) =>
        `${student_first_name} ${student_last_name ?? ""}`.toLowerCase().includes(q) ||
        student_admission_no?.toLowerCase().includes(q)
    );
  }, [allStudents, search]);

  const showSkeleton = Boolean(selectedCampus && loading);
  const isFiltered = search.length > 0;
  const hasStudents = allStudents.length > 0;
  const hasResults = list.length > 0;

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
                Retry
              </button>
            )}
            {onDismissError && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onDismissError}>
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="sm:w-48 sm:shrink-0">
          <Dropdown
            options={campuses}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name or admission no..."
            />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedCampus}>
              <span className="hidden sm:inline">+ Add Student</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {selectedCampus && !loading && hasStudents && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${list.length} of ${allStudents.length} student${allStudents.length !== 1 ? "s" : ""}`
            : `${allStudents.length} student${allStudents.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && !loading && (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a campus</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to view its students</p>
        </div>
      )}

      {/* Empty campus — no students */}
      {selectedCampus && !loading && !hasStudents && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No students yet</p>
          <p className="text-sm text-gray-400 mt-1">Add the first student to this campus</p>
          <Button className="mt-4" onClick={handleCreate}>
            + Add Student
          </Button>
        </div>
      )}

      {/* No search results */}
      {selectedCampus && !loading && hasStudents && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No students match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or admission number</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : list.map((student) => (
              <StudentCard
                key={student.student_id}
                student={student}
                onClick={() => handleSelectStudent(student.student_id)}
              />
            ))}
      </Listing>
    </>
  );
}
