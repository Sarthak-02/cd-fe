import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-teal-100 text-teal-700",
  "bg-violet-100 text-violet-700",
  "bg-blue-200 text-blue-800",
  "bg-indigo-200 text-indigo-800",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function SchoolCard({ school, onClick }) {
  const initial = (school.school_name || "?")[0].toUpperCase();
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(school.school_name)}`}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
          {school.school_name}
        </p>
        <p className="mt-1">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
            {school.school_id}
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
  return err?.message || "Could not load schools.";
}

export default function SchoolListing({
  handleCreate,
  schools,
  handleSelectSchool,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const [search, setSearch] = useState("");

  const allSchools = schools ?? [];

  const filteredSchools = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allSchools;
    return allSchools.filter(
      ({ school_id, school_name }) =>
        school_id.toLowerCase().includes(q) ||
        school_name.toLowerCase().includes(q)
    );
  }, [search, allSchools]);

  const isFiltered = search.length > 0;
  const hasSchools = allSchools.length > 0;
  const hasResults = filteredSchools.length > 0;

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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID..." />
        </div>
        <div className="shrink-0">
          <Button onClick={handleCreate}>
            <span className="hidden sm:inline">+ Add School</span>
            <span className="sm:hidden">+ Add</span>
          </Button>
        </div>
      </div>

      {/* Result count */}
      {!loading && hasSchools && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${filteredSchools.length} of ${allSchools.length} school${allSchools.length !== 1 ? "s" : ""}`
            : `${allSchools.length} school${allSchools.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* No schools yet */}
      {!loading && !hasSchools && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No schools yet</p>
          <p className="text-sm text-gray-400 mt-1">Add the first school to get started</p>
          <Button className="mt-4" onClick={handleCreate}>+ Add School</Button>
        </div>
      )}

      {/* No search results */}
      {!loading && hasSchools && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-gray-600">No schools match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or ID</p>
        </div>
      )}

      <Listing>
        {loading
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredSchools.map((school) => (
              <SchoolCard
                key={school.school_id}
                school={school}
                onClick={() => handleSelectSchool(school.school_id)}
              />
            ))}
      </Listing>
    </>
  );
}
