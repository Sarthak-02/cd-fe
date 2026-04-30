import { useMemo } from "react";
import Button from "../../ui-components/Button";
import Card from "../../ui-components/Card";
import Dropdown from "../../ui-components/Dropdown";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

const STATUS_LABELS = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Could not load dashboard configs.";
}

export default function DashboardConfigListing({
  configs,
  loading,
  error,
  allCampus,
  selectedCampus,
  setSelectedCampus,
  handleCreate,
  handleSelectConfig,
  onRetry,
  onDismissError,
}) {
  const showSkeleton = Boolean(selectedCampus && loading);

  const activeCount = useMemo(
    () => configs.filter((c) => c.status === "active").length,
    [configs]
  );

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

      {selectedCampus && !loading && configs.length > 0 && (
        <p className="text-xs text-gray-400 mb-4">
          {configs.length} config{configs.length !== 1 ? "s" : ""} · {activeCount} active
        </p>
      )}

      {selectedCampus && !loading && configs.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-medium">No dashboard configs yet</p>
          <p className="mt-1">Create one to define how the student dashboard looks for this campus.</p>
        </div>
      )}

      {!selectedCampus && (
        <div className="text-center py-20 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-3">🏫</p>
          <p className="font-medium">Select a campus to get started</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
          : configs.map((config) => (
              <Card
                key={config.config_id}
                title={config.config_name}
                subtitle={config.config_description || `${config.school_level || "primary"} · ${STATUS_LABELS[config.status] || config.status}`}
                details={{
                  Skills: `${config.skills?.length || 0} skill${(config.skills?.length || 0) !== 1 ? "s" : ""}`,
                  Classes: `${config.enabled_classes?.length || 0} enabled`,
                  "Rating Scale": config.rating_scale?.type || "—",
                  Status: STATUS_LABELS[config.status] || config.status,
                }}
                onClick={() => handleSelectConfig(config.config_id)}
              />
            ))}
      </Listing>
    </>
  );
}
