import React, { useState, useEffect } from "react";
import {
  PRICE_TIERS,
  STUDENT_FEATURES,
  STAFF_FEATURES,
  DEFAULT_TIER_CONFIG,
} from "../../utils/constants/priceTierPermissions";
import { useCampusStore } from "../../store/campus.store";
import { useClassStore } from "../../store/class.store";
import { useCampusTierPermissionStore } from "../../store/campusTierPermission.store";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function FeatureSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function FeatureRow({ feature, config, classOptions, onToggle, onClassesChange }) {
  const { enabled, classes } = config;
  return (
    <div
      className={`border rounded-xl p-3 transition-all duration-200 ${
        enabled ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-sm font-medium leading-snug ${
            enabled ? "text-blue-900" : "text-gray-700"
          }`}
        >
          {feature.label}
        </span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      {enabled && (
        <div className="mt-3">
          <Dropdown
            label="Applicable classes"
            multi
            options={classOptions}
            selected={classes}
            onChange={onClassesChange}
            placeholder="Select classes..."
          />
        </div>
      )}
    </div>
  );
}

function FeatureSection({
  title,
  features,
  tierConfig,
  classOptions,
  onToggle,
  onClassesChange,
  onToggleAll,
}) {
  const enabledInSection = features.filter((f) => tierConfig[f.id]?.enabled).length;
  const allEnabled = enabledInSection === features.length;
  const noneEnabled = enabledInSection === 0;

  return (
    <div className="mb-7">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-xs text-gray-400">
          {enabledInSection}/{features.length} enabled
        </span>
        <button
          type="button"
          className="ml-auto text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
          onClick={() => onToggleAll(features.map((f) => f.id), !allEnabled)}
        >
          {allEnabled ? "Disable All" : noneEnabled ? "Enable All" : "Enable All"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature) => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            config={tierConfig[feature.id]}
            classOptions={classOptions}
            onToggle={(val) => onToggle(feature.id, val)}
            onClassesChange={(val) => onClassesChange(feature.id, val)}
          />
        ))}
      </div>
    </div>
  );
}

// Build the local UI config by merging API records over defaults.
// `apiPermissions` shape: { [tier]: { [feature_id]: { enabled, class_ids } } }
function buildCampusConfig(allClassIds, apiPermissions) {
  const result = {};
  for (const tier of PRICE_TIERS) {
    result[tier.value] = {};
    const apiTier = apiPermissions?.[tier.value] ?? {};
    for (const [featureId, defaultConfig] of Object.entries(
      DEFAULT_TIER_CONFIG[tier.value]
    )) {
      const apiConfig = apiTier[featureId];
      if (apiConfig) {
        result[tier.value][featureId] = {
          enabled: !!apiConfig.enabled,
          classes: Array.isArray(apiConfig.class_ids) ? apiConfig.class_ids : [],
        };
      } else {
        result[tier.value][featureId] = {
          enabled: !!defaultConfig.enabled,
          classes: [...allClassIds],
        };
      }
    }
  }
  return result;
}

const FEATURES_BY_ROLE = {
  student: STUDENT_FEATURES,
  staff: STAFF_FEATURES,
};

export default function PriceTierPermissionsConfig() {
  const { campuses, loading: loadingCampuses, fetchCampuses } = useCampusStore();
  const { classes, loading: loadingClasses, fetchClasses } = useClassStore();
  const {
    permissionsByCampus,
    loading: loadingPermissions,
    saving: savingPermissions,
    fetchAllForCampus,
    saveTierPermissions,
  } = useCampusTierPermissionStore();

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedTier, setSelectedTier] = useState(PRICE_TIERS[0].value);
  const [campusConfigs, setCampusConfigs] = useState({});
  const [savedTiers, setSavedTiers] = useState({});
  const [dirty, setDirty] = useState({});
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate local config once classes + permissions are loaded for the campus.
  useEffect(() => {
    if (!selectedCampus) return;
    if (loadingClasses || loadingPermissions) return;
    if (!classes?.length) return;
    if (campusConfigs[selectedCampus]) return;

    const allClassIds = classes.map((c) => c.class_id);
    const apiPermissions = permissionsByCampus[selectedCampus];
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: buildCampusConfig(allClassIds, apiPermissions),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCampus,
    loadingClasses,
    loadingPermissions,
    classes,
    permissionsByCampus,
  ]);

  async function handleCampusChange(campusId) {
    setSelectedCampus(campusId);
    setSavedTiers({});
    setDirty({});
    setSaveError("");
    if (!campusId) return;
    fetchClasses(campusId);
    try {
      await fetchAllForCampus(campusId);
    } catch (err) {
      console.log("Failed to load campus tier permissions", err);
    }
  }

  function getCurrentTierConfig() {
    return campusConfigs[selectedCampus]?.[selectedTier] ?? null;
  }

  function handleToggle(featureId, value) {
    const current = getCurrentTierConfig();
    if (!current) return;
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: {
        ...prev[selectedCampus],
        [selectedTier]: {
          ...current,
          [featureId]: { ...current[featureId], enabled: value },
        },
      },
    }));
    setDirty((prev) => ({ ...prev, [selectedTier]: true }));
    setSavedTiers((prev) => ({ ...prev, [selectedTier]: false }));
  }

  function handleClassesChange(featureId, newClasses) {
    const current = getCurrentTierConfig();
    if (!current) return;
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: {
        ...prev[selectedCampus],
        [selectedTier]: {
          ...current,
          [featureId]: { ...current[featureId], classes: newClasses },
        },
      },
    }));
    setDirty((prev) => ({ ...prev, [selectedTier]: true }));
    setSavedTiers((prev) => ({ ...prev, [selectedTier]: false }));
  }

  function handleToggleAll(featureIds, value) {
    const current = getCurrentTierConfig();
    if (!current) return;
    const updates = {};
    featureIds.forEach((id) => {
      updates[id] = { ...current[id], enabled: value };
    });
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: {
        ...prev[selectedCampus],
        [selectedTier]: { ...current, ...updates },
      },
    }));
    setDirty((prev) => ({ ...prev, [selectedTier]: true }));
    setSavedTiers((prev) => ({ ...prev, [selectedTier]: false }));
  }

  async function handleSave() {
    const tierConfig = getCurrentTierConfig();
    if (!tierConfig || !selectedCampus) return;

    const features = Object.entries(FEATURES_BY_ROLE).flatMap(([role, list]) =>
      list.map((f) => {
        const cfg = tierConfig[f.id] ?? { enabled: false, classes: [] };
        return {
          role,
          feature_id: f.id,
          enabled: !!cfg.enabled,
          class_ids: cfg.classes ?? [],
        };
      })
    );

    setSaveError("");
    try {
      await saveTierPermissions(selectedCampus, selectedTier, features);
      setSavedTiers((prev) => ({ ...prev, [selectedTier]: true }));
      setDirty((prev) => ({ ...prev, [selectedTier]: false }));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save permissions. Please try again.";
      setSaveError(msg);
    }
  }

  const campusOptions = (campuses ?? []).map((c) => ({
    value: c.campus_id,
    label: c.campus_name,
  }));
  const classOptions = (classes ?? []).map((c) => ({
    value: c.class_id,
    label: c.class_name,
  }));

  const currentConfig = getCurrentTierConfig();
  const totalFeatures = STUDENT_FEATURES.length + STAFF_FEATURES.length;
  const enabledTotal = currentConfig
    ? Object.values(currentConfig).filter((v) => v.enabled).length
    : 0;

  const showLoader =
    selectedCampus && (loadingClasses || loadingPermissions || !currentConfig);

  return (
    <div className="flex flex-col gap-6">
      {/* Campus selector */}
      <div className="w-full md:w-1/2 lg:w-2/5">
        <Dropdown
          label="Campus"
          options={campusOptions}
          selected={selectedCampus}
          onChange={handleCampusChange}
          placeholder={loadingCampuses ? "Loading campuses..." : "Select a campus"}
        />
      </div>

      {/* Empty state — no campus selected */}
      {!selectedCampus && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a campus</p>
          <p className="text-sm text-gray-400 mt-1">Choose a campus above to configure its feature permissions</p>
        </div>
      )}

      {/* Loading skeleton */}
      {showLoader && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-row lg:flex-col gap-2 lg:w-44 shrink-0">
            {PRICE_TIERS.map((t) => (
              <div key={t.value} className="h-16 lg:w-full shrink-0 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-6 w-1/3 bg-gray-100 rounded animate-pulse mb-5" />
            <FeatureSkeleton />
          </div>
        </div>
      )}

      {/* Main config */}
      {selectedCampus && !showLoader && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Tier selector */}
          <div className="flex flex-row lg:flex-col gap-2 lg:w-44 shrink-0 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {PRICE_TIERS.map((tier) => {
              const config = campusConfigs[selectedCampus]?.[tier.value];
              const count = config
                ? Object.values(config).filter((v) => v.enabled).length
                : 0;
              const isSelected = selectedTier === tier.value;
              const hasDirty = dirty[tier.value];
              const isSaved = savedTiers[tier.value];
              return (
                <button
                  key={tier.value}
                  onClick={() => setSelectedTier(tier.value)}
                  className={`shrink-0 lg:w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">{tier.label}</span>
                    {hasDirty && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          isSelected ? "bg-blue-200" : "bg-orange-400"
                        }`}
                      />
                    )}
                    {isSaved && !hasDirty && (
                      <svg
                        className={`w-3 h-3 shrink-0 ${isSelected ? "text-blue-200" : "text-green-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {count}/{totalFeatures} features
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Feature config */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {PRICE_TIERS.find((t) => t.value === selectedTier)?.label} Tier
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {enabledTotal} of {totalFeatures} features enabled
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {savedTiers[selectedTier] && !dirty[selectedTier] && (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={!dirty[selectedTier] || savingPermissions}
                >
                  {savingPermissions ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            {saveError && (
              <div className="mb-4 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                {saveError}
              </div>
            )}

            <FeatureSection
              title="Student"
              features={STUDENT_FEATURES}
              tierConfig={currentConfig}
              classOptions={classOptions}
              onToggle={handleToggle}
              onClassesChange={handleClassesChange}
              onToggleAll={handleToggleAll}
            />

            <FeatureSection
              title="Staff / Teacher"
              features={STAFF_FEATURES}
              tierConfig={currentConfig}
              classOptions={classOptions}
              onToggle={handleToggle}
              onClassesChange={handleClassesChange}
              onToggleAll={handleToggleAll}
            />
          </div>
        </div>
      )}
    </div>
  );
}
