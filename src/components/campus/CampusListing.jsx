import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-teal-100 text-teal-700",
  "bg-green-100 text-green-700",
  "bg-cyan-100 text-cyan-700",
  "bg-lime-100 text-lime-700",
  "bg-emerald-200 text-emerald-800",
  "bg-teal-200 text-teal-800",
  "bg-green-200 text-green-800",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function CampusCard({ campus, onClick }) {
  const initial = (campus.campus_name || "?")[0].toUpperCase();
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(campus.campus_name)}`}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
          {campus.campus_name}
        </p>
        <p className="mt-1">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
            {campus.campus_id}
          </span>
        </p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  return err?.message || "Could not load campuses.";
}

export default function CampusListing({
  handleCreate,
  campuses,
  loading,
  error,
  onRetry,
  onDismissError,
  handleSelectCampus,
  allSchools,
  selectedSchool,
  setSelectedSchool,
}) {
  const [search, setSearch] = useState("");

  const campusesForSchool = useMemo(() => {
    const list = campuses ?? [];
    if (!selectedSchool) return list;
    return list.filter((campus) => campus.school_id === selectedSchool);
  }, [campuses, selectedSchool]);

  const filteredCampus = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return campusesForSchool;
    return campusesForSchool.filter(
      ({ campus_name, campus_id }) =>
        campus_name?.toLowerCase().includes(q) ||
        campus_id?.toLowerCase().includes(q)
    );
  }, [campusesForSchool, search]);

  const isFiltered = search.length > 0;
  const hasCampuses = campusesForSchool.length > 0;
  const hasResults = filteredCampus.length > 0;

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
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onRetry}>Retry</button>
            )}
            {onDismissError && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onDismissError}>Dismiss</button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="sm:w-48 sm:shrink-0">
          <Dropdown
            options={allSchools}
            selected={selectedSchool}
            onChange={setSelectedSchool}
          />
        </div>
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID..." />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedSchool}>
              <span className="hidden sm:inline">+ Add Campus</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {!loading && hasCampuses && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${filteredCampus.length} of ${campusesForSchool.length} campus${campusesForSchool.length !== 1 ? "es" : ""}`
            : `${campusesForSchool.length} campus${campusesForSchool.length !== 1 ? "es" : ""}`}
        </p>
      )}

      {/* No campuses */}
      {!loading && !hasCampuses && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">
            {selectedSchool ? "No campuses for this school" : "No campuses yet"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {selectedSchool ? "Add the first campus to this school" : "Select a school above then add a campus"}
          </p>
          {selectedSchool && (
            <Button className="mt-4" onClick={handleCreate}>+ Add Campus</Button>
          )}
        </div>
      )}

      {/* No search results */}
      {!loading && hasCampuses && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-gray-600">No campuses match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or ID</p>
        </div>
      )}

      <Listing>
        {loading
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredCampus.map((campus) => (
              <CampusCard
                key={campus.campus_id}
                campus={campus}
                onClick={() => handleSelectCampus(campus.campus_id)}
              />
            ))}
      </Listing>
    </>
  );
}
