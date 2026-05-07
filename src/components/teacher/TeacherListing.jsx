import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";

const AVATAR_COLORS = [
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-green-100 text-green-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-lime-100 text-lime-700",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function TeacherCard({ teacher, onClick }) {
  const parts = (teacher.fullname || "").trim().split(" ");
  const initials = [parts[0]?.[0], parts[parts.length - 1]?.[0]]
    .filter((c, i, a) => c && (a.length === 1 || i !== a.length - 1 || parts.length > 1))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(teacher.fullname)}`}
      >
        {initials || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
          {teacher.fullname || "—"}
        </p>
        <p className="mt-1">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
            {teacher.teacher_employee_code}
          </span>
        </p>
      </div>

      <svg
        className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors"
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
  return err?.message || "Could not load teachers.";
}

export default function TeacherListing({
  handleCreate,
  teachers,
  handleSelectTeacher,
  campuses,
  selectedCampus,
  setSelectedCampus,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const [search, setSearch] = useState("");

  const allTeachers = teachers ?? [];

  const list = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allTeachers;
    return allTeachers.filter(
      ({ fullname, teacher_employee_code }) =>
        fullname?.toLowerCase().includes(q) ||
        teacher_employee_code?.toLowerCase().includes(q)
    );
  }, [allTeachers, search]);

  const showSkeleton = Boolean(selectedCampus && loading);
  const isFiltered = search.length > 0;
  const hasTeachers = allTeachers.length > 0;
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
              placeholder="Search by name or employee code..."
            />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedCampus}>
              <span className="hidden sm:inline">+ Add Teacher</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {selectedCampus && !loading && hasTeachers && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${list.length} of ${allTeachers.length} teacher${allTeachers.length !== 1 ? "s" : ""}`
            : `${allTeachers.length} teacher${allTeachers.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && !loading && (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422A12.083 12.083 0 0121 21H3a12.083 12.083 0 012.84-10.422L12 14z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a campus</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to view its teachers</p>
        </div>
      )}

      {/* Campus has no teachers */}
      {selectedCampus && !loading && !hasTeachers && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No teachers yet</p>
          <p className="text-sm text-gray-400 mt-1">Add the first teacher to this campus</p>
          <Button className="mt-4" onClick={handleCreate}>
            + Add Teacher
          </Button>
        </div>
      )}

      {/* No search results */}
      {selectedCampus && !loading && hasTeachers && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-gray-600">No teachers match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or employee code</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : list.map((teacher) => (
              <TeacherCard
                key={teacher.teacher_id}
                teacher={teacher}
                onClick={() => handleSelectTeacher(teacher.teacher_id)}
              />
            ))}
      </Listing>
    </>
  );
}
