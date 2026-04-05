import React, { useMemo } from "react";
import Button from "../../ui-components/Button";
import Card from "../../ui-components/Card";
import Dropdown from "../../ui-components/Dropdown";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

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
  const filteredClass = useMemo(() => {
    if (!selectedCampus) {
      return [];
    }
    const list = classes ?? [];
    return list.filter((_class) => _class?.campus_id === selectedCampus);
  }, [selectedCampus, classes]);

  const showSkeleton = Boolean(selectedCampus && loading);

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
            options={allCampus}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate} disabled={!selectedCampus}>
            Create
          </Button>
        </div>
      </div>

      <Listing>
        {showSkeleton
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredClass.map((classItem) => (
              <Card
                key={classItem.class_id}
                title={classItem.class_name}
                subtitle={classItem.class_id}
                onClick={() => handleSelectClass(classItem.class_id)}
              />
            ))}
      </Listing>
    </>
  );
}
