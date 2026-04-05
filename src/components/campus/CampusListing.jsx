import React, { useMemo } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";

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
  const filteredCampus = useMemo(() => {
    const list = campuses ?? [];
    if (!selectedSchool) {
      return list;
    }
    return list.filter((campus) => campus.school_id === selectedSchool);
  }, [selectedSchool, campuses]);

  return (
    <>
      {error && (
        <div
          className="mb-4 rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm flex flex-wrap items-center justify-between gap-2"
          role="alert"
        >
          <span>{apiErrorMessage(error)}</span>
          <div className="flex gap-2 shrink-0">
            {onRetry && (
              <button
                type="button"
                className="text-sm font-medium text-red-900 underline"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
            {onDismissError && (
              <button
                type="button"
                className="text-sm font-medium text-red-900 underline"
                onClick={onDismissError}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 md:w-3/5 lg:w-2/5">
          <Dropdown
            options={allSchools}
            selected={selectedSchool}
            onChange={setSelectedSchool}
          />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate} disabled={!selectedSchool}>
            Create
          </Button>
        </div>
      </div>

      <Listing>
        {loading
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredCampus.map((campus) => {
              return (
                <Card
                  key={campus.campus_id}
                  title={campus.campus_name}
                  subtitle={campus.campus_id}
                  onClick={() => handleSelectCampus(campus.campus_id)}
                />
              );
            })}
      </Listing>
    </>
  );
}
