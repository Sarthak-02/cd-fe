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
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  waitlisted: "bg-orange-50 text-orange-700",
  enrolled: "bg-blue-50 text-blue-700",
};

function AdmissionCard({ admission, onClick }) {
  const initials = [admission.admission_first_name?.[0], admission.admission_last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  const fullName = `${admission.admission_first_name} ${admission.admission_last_name ?? ""}`.trim();
  const status = admission.admission_status?.toLowerCase();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${avatarColor(admission.admission_first_name)}`}
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
            {admission.admission_application_no}
          </span>
          {admission.admission_academic_year && (
            <span className="text-xs text-gray-400 shrink-0">{admission.admission_academic_year}</span>
          )}
        </div>
        {admission.admission_father_name && (
          <p className="text-xs text-gray-400 mt-1 truncate">S/O {admission.admission_father_name}</p>
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
  return err?.message || "Could not load admissions.";
}

export default function AdmissionListing({
  handleCreate,
  admissions,
  handleSelectAdmission,
  campuses,
  selectedCampus,
  setSelectedCampus,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const [search, setSearch] = useState("");

  const allAdmissions = admissions ?? [];

  const list = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allAdmissions;
    return allAdmissions.filter(
      ({ admission_first_name, admission_last_name, admission_application_no }) =>
        `${admission_first_name} ${admission_last_name ?? ""}`.toLowerCase().includes(q) ||
        admission_application_no?.toLowerCase().includes(q)
    );
  }, [allAdmissions, search]);

  const showSkeleton = Boolean(selectedCampus && loading);
  const isFiltered = search.length > 0;
  const hasAdmissions = allAdmissions.length > 0;
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
              placeholder="Search by name or application no..."
            />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedCampus}>
              <span className="hidden sm:inline">+ Add Admission</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {selectedCampus && !loading && hasAdmissions && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${list.length} of ${allAdmissions.length} application${allAdmissions.length !== 1 ? "s" : ""}`
            : `${allAdmissions.length} application${allAdmissions.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && !loading && (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a campus</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to view its admissions</p>
        </div>
      )}

      {/* Empty campus — no admissions */}
      {selectedCampus && !loading && !hasAdmissions && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No admission applications yet</p>
          <p className="text-sm text-gray-400 mt-1">Add the first application for this campus</p>
          <Button className="mt-4" onClick={handleCreate}>
            + Add Admission
          </Button>
        </div>
      )}

      {/* No search results */}
      {selectedCampus && !loading && hasAdmissions && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No applications match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or application number</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : list.map((admission) => (
              <AdmissionCard
                key={admission.admission_id}
                admission={admission}
                onClick={() => handleSelectAdmission(admission.admission_id)}
              />
            ))}
      </Listing>
    </>
  );
}
