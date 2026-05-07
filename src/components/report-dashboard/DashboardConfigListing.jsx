import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import SearchBar from "../../ui-components/SearchBar";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-pink-100 text-pink-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-purple-100 text-purple-700",
  "bg-violet-100 text-violet-700",
  "bg-indigo-100 text-indigo-700",
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

const STATUS_BADGE = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  draft: "bg-yellow-100 text-yellow-700",
};

function ConfigCard({ config, skillCount, statusLabel, onClick }) {
  const initial = (config.config_name || "?")[0].toUpperCase();
  const n = config.skills?.length || 0;
  const badgeClass = STATUS_BADGE[config.status] || "bg-gray-100 text-gray-500";

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${avatarColor(config.config_name)}`}>
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
            {config.config_name}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${badgeClass}`}>
            {statusLabel}
          </span>
        </div>

        {config.config_description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{config.config_description}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>{skillCount(n)}</span>
          <span>{config.enabled_classes?.length || 0} classes</span>
          {config.rating_scale?.type && <span>{config.rating_scale.type}</span>}
        </div>
      </div>

      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function apiErrorMessage(err, fallback) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || fallback;
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
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const showSkeleton = Boolean(selectedCampus && loading);

  const filteredConfigs = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return configs;
    return configs.filter(
      ({ config_name, config_description }) =>
        config_name?.toLowerCase().includes(q) ||
        config_description?.toLowerCase().includes(q)
    );
  }, [configs, search]);

  const activeCount = useMemo(
    () => configs.filter((c) => c.status === "active").length,
    [configs]
  );

  const skillCount = (n) =>
    n === 1
      ? t("reportDashboard.cardDetails.skillCount", { count: n })
      : t("reportDashboard.cardDetails.skillCountPlural", { count: n });

  const isFiltered = search.length > 0;
  const hasConfigs = configs.length > 0;
  const hasResults = filteredConfigs.length > 0;

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
            <span>{apiErrorMessage(error, t("reportDashboard.listing.defaultError"))}</span>
          </div>
          <div className="flex gap-3 shrink-0">
            {onRetry && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onRetry}>
                {t("reportDashboard.buttons.retry")}
              </button>
            )}
            {onDismissError && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onDismissError}>
                {t("reportDashboard.buttons.dismiss")}
              </button>
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
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or description..." />
          </div>
          <div className="shrink-0">
            <Button onClick={handleCreate} disabled={!selectedCampus}>
              <span className="hidden sm:inline">{t("reportDashboard.buttons.createNew")}</span>
              <span className="sm:hidden">+ Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result count */}
      {selectedCampus && !loading && hasConfigs && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? `Showing ${filteredConfigs.length} of ${configs.length} config${configs.length !== 1 ? "s" : ""}`
            : `${configs.length !== 1
                ? t("reportDashboard.listing.configCountPlural", { count: configs.length })
                : t("reportDashboard.listing.configCount", { count: configs.length })} · ${t("reportDashboard.listing.activeCount", { count: activeCount })}`}
        </p>
      )}

      {/* No campus selected */}
      {!selectedCampus && (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">{t("reportDashboard.listing.selectCampusTitle")}</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to view its report configs</p>
        </div>
      )}

      {/* No configs yet */}
      {selectedCampus && !loading && !hasConfigs && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-medium text-gray-600">{t("reportDashboard.listing.emptyTitle")}</p>
          <p className="text-sm text-gray-400 mt-1">{t("reportDashboard.listing.emptyDescription")}</p>
          <Button className="mt-4" onClick={handleCreate}>{t("reportDashboard.buttons.createNew")}</Button>
        </div>
      )}

      {/* No search results */}
      {selectedCampus && !loading && hasConfigs && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-gray-600">No configs match &ldquo;{search}&rdquo;</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name or description</p>
        </div>
      )}

      <Listing>
        {showSkeleton
          ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
          : filteredConfigs.map((config) => (
              <ConfigCard
                key={config.config_id}
                config={config}
                skillCount={skillCount}
                statusLabel={t(`reportDashboard.statusOptions.${config.status}`) || config.status}
                onClick={() => handleSelectConfig(config.config_id)}
              />
            ))}
      </Listing>
    </>
  );
}
