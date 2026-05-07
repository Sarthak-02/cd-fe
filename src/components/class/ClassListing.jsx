import React, { useMemo, useState } from "react";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-200 text-orange-800",
  "bg-amber-200 text-amber-800",
  "bg-red-100 text-red-700",
  "bg-rose-100 text-rose-700",
  "bg-pink-100 text-pink-700",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function ClassCard({ classItem, onClick }) {
  const initial = (classItem.class_name || "?")[0].toUpperCase();
  const type = classItem.class_type || classItem.extras?.class_type;
  const description = classItem.class_description || classItem.extras?.class_description;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${avatarColor(classItem.class_name)}`}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
            {classItem.class_name}
          </p>
          {type && (
            <span className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full shrink-0">
              {type}
            </span>
          )}
        </div>
        <p className="mt-1">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
            {classItem.class_id}
          </span>
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
        )}
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  return err?.message || "Could not load classes.";
}

export default function ClassListing({
  handleCreate,
  classes,
  handleSelectClass,
  allCampus,
  selectedCampus,
  setSelectedCampus,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const [search, setSearch] = useState("");

  const classesByCampus = useMemo(() => {
    if (!selectedCampus) return [];
    return (classes ?? []).filter((_class) => _class?.campus_id === selectedCampus);
  }, [selectedCampus, classes]);

  const filteredClass = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return classesByCampus;
    return classesByCampus.filter(
      ({ class_name, class_id }) =>
        class_name?.toLowerCase().includes(q) ||
        class_id?.toLowerCase().includes(q)
    );
  }, [classesByCampus, search]);

  const showSkeleton = Boolean(selectedCampus && loading);
  const isFiltered = search.length > 0;
  const hasClasses = classesByCampus.length > 0;
  const hasResults = filteredClass.length > 0;

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
            options={allCampus}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID..." />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedCampus}>
              <span className="hidden sm:inline">+ Add Class</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {selectedCampus && !loading && hasClasses && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${filteredClass.length} of ${classesByCampus.length} class${classesByCampus.length !== 1 ? "es" : ""}`
            : `${classesByCampus.length} class${classesByCampus.length !== 1 ? "es" : ""}`}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && !loading && (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a campus</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to view its classes</p>
        </div>
      )}

      {/* No classes yet */}
      {selectedCampus && !loading && !hasClasses && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No classes yet</p>
          <p className="text-sm text-gray-400 mt-1">Add the first class to this campus</p>
          <Button className="mt-4" onClick={handleCreate}>+ Add Class</Button>
        </div>
      )}

      {/* No search results */}
      {selectedCampus && !loading && hasClasses && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No classes match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or ID</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredClass.map((classItem) => (
              <ClassCard
                key={classItem.class_id}
                classItem={classItem}
                onClick={() => handleSelectClass(classItem.class_id)}
              />
            ))}
      </Listing>
    </>
  );
}
