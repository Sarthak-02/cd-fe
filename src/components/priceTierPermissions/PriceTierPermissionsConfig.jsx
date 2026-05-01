import React, { useState, useEffect } from "react";
import {
  PRICE_TIERS,
  STUDENT_FEATURES,
  STAFF_FEATURES,
  DEFAULT_TIER_CONFIG,
} from "../../utils/constants/priceTierPermissions";
import { useCampusStore } from "../../store/campus.store";
import { useClassStore } from "../../store/class.store";
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

function FeatureRow({ feature, config, classOptions, onToggle, onClassesChange }) {
  const { enabled, classes } = config;
  return (
    <div
      className={`border rounded-xl p-3 transition-all duration-200 ${
        enabled ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
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

function FeatureSection({ title, features, tierConfig, classOptions, onToggle, onClassesChange }) {
  const enabledInSection = features.filter((f) => tierConfig[f.id]?.enabled).length;
  return (
    <div className="mb-7">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-xs text-gray-400">
          {enabledInSection}/{features.length} enabled
        </span>
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

function buildCampusConfig(allClassIds) {
  const result = {};
  for (const tier of PRICE_TIERS) {
    result[tier.value] = {};
    for (const [featureId, featureConfig] of Object.entries(DEFAULT_TIER_CONFIG[tier.value])) {
      result[tier.value][featureId] = {
        enabled: featureConfig.enabled,
        classes: [...allClassIds],
      };
    }
  }
  return result;
}

export default function PriceTierPermissionsConfig() {
  const { campuses, loading: loadingCampuses, fetchCampuses } = useCampusStore();
  const { classes, loading: loadingClasses, fetchClasses } = useClassStore();

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedTier, setSelectedTier] = useState(PRICE_TIERS[0].value);
  const [campusConfigs, setCampusConfigs] = useState({});
  const [savedTiers, setSavedTiers] = useState({});
  const [dirty, setDirty] = useState({});

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once classes load, initialise this campus's config with all classes selected
  useEffect(() => {
    if (!selectedCampus || loadingClasses || classes.length === 0) return;
    if (campusConfigs[selectedCampus]) return;
    const allClassIds = classes.map((c) => c.class_id);
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: buildCampusConfig(allClassIds),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampus, loadingClasses, classes]);

  function handleCampusChange(campusId) {
    setSelectedCampus(campusId);
    setSavedTiers({});
    setDirty({});
    if (campusId) fetchClasses(campusId);
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

  function handleClassesChange(featureId, classes) {
    const current = getCurrentTierConfig();
    if (!current) return;
    setCampusConfigs((prev) => ({
      ...prev,
      [selectedCampus]: {
        ...prev[selectedCampus],
        [selectedTier]: {
          ...current,
          [featureId]: { ...current[featureId], classes },
        },
      },
    }));
    setDirty((prev) => ({ ...prev, [selectedTier]: true }));
    setSavedTiers((prev) => ({ ...prev, [selectedTier]: false }));
  }

  function handleSave() {
    // TODO: persist via API
    setSavedTiers((prev) => ({ ...prev, [selectedTier]: true }));
    setDirty((prev) => ({ ...prev, [selectedTier]: false }));
  }

  const campusOptions = campuses.map((c) => ({ value: c.campus_id, label: c.campus_name }));
  const classOptions = classes.map((c) => ({ value: c.class_id, label: c.class_name }));

  const currentConfig = getCurrentTierConfig();
  const totalFeatures = STUDENT_FEATURES.length + STAFF_FEATURES.length;
  const enabledTotal = currentConfig
    ? Object.values(currentConfig).filter((v) => v.enabled).length
    : 0;

  const showLoader = selectedCampus && (loadingClasses || !currentConfig);

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

      {!selectedCampus && (
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-300 rounded-xl text-gray-400 text-sm">
          Select a campus to configure its tier permissions
        </div>
      )}

      {showLoader && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Loading classes...
        </div>
      )}

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
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-blue-200" : "bg-orange-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {count} / {totalFeatures} features
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
                {savedTiers[selectedTier] && (
                  <span className="text-sm text-green-600 font-medium">Saved</span>
                )}
                <Button onClick={handleSave} size="sm" disabled={!dirty[selectedTier]}>
                  Save Changes
                </Button>
              </div>
            </div>

            <FeatureSection
              title="Student"
              features={STUDENT_FEATURES}
              tierConfig={currentConfig}
              classOptions={classOptions}
              onToggle={handleToggle}
              onClassesChange={handleClassesChange}
            />

            <FeatureSection
              title="Staff / Teacher"
              features={STAFF_FEATURES}
              tierConfig={currentConfig}
              classOptions={classOptions}
              onToggle={handleToggle}
              onClassesChange={handleClassesChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
