import React, { useState } from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { sortByOrder, buildSlotLabel } from "../../utils/utility_functions/timetableHelpers";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import { useTranslation } from "react-i18next";

const SLOT_TYPE_STYLES = {
  class:    { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  break:    { badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
  lunch:    { badge: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  assembly: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};

function SlotTypeBadge({ type, label }) {
  const style = SLOT_TYPE_STYLES[type] || SLOT_TYPE_STYLES.class;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}

export default function TimetableConfigPanel() {
  const { t } = useTranslation();

  const { days, slots, addSlot, updateSlot, removeSlot, toggleDay } = useTimetableStore();

  const [slotForm, setSlotForm] = useState({ startTime: "", endTime: "", type: "class" });
  const [timeError, setTimeError] = useState("");

  const sortedSlots = sortByOrder(slots);
  const sortedDays = sortByOrder(days);
  const activeDayCount = days.filter((d) => d.isActive).length;

  const slotTypeOptions = [
    { label: t("timetable.slotTypes.class"),    value: "class" },
    { label: t("timetable.slotTypes.break"),    value: "break" },
    { label: t("timetable.slotTypes.lunch"),    value: "lunch" },
    { label: t("timetable.slotTypes.assembly"), value: "assembly" },
  ];

  const DAY_SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };

  const validateTimes = (start, end) => {
    if (!start || !end) return true;
    return start < end;
  };

  const handleAddSlot = () => {
    if (!slotForm.startTime || !slotForm.endTime) return;
    if (!validateTimes(slotForm.startTime, slotForm.endTime)) {
      setTimeError(t("timetable.errors.endBeforeStart"));
      return;
    }
    setTimeError("");
    addSlot({
      label: buildSlotLabel(slotForm.startTime, slotForm.endTime),
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      type: slotForm.type,
    });
    setSlotForm({ startTime: "", endTime: "", type: "class" });
  };

  const handleUpdateTime = (slot, field, value) => {
    const newStart = field === "startTime" ? value : slot.startTime;
    const newEnd   = field === "endTime"   ? value : slot.endTime;
    if (newStart && newEnd && !validateTimes(newStart, newEnd)) return;
    updateSlot(slot.id, { [field]: value, label: buildSlotLabel(newStart, newEnd) });
  };

  return (
    <div className="grid gap-4">
      {/* Working Days */}
      <div className="bg-white shadow-sm rounded-2xl p-4 border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">{t("timetable.sections.workingDays")}</h2>
          <span className="text-xs text-gray-500">{activeDayCount} {t("timetable.labels.daysActive")}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedDays.map((day) => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                day.isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {DAY_SHORT[day.label] || day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white shadow-sm rounded-2xl p-4 border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">{t("timetable.sections.timeSlots")}</h2>
          {sortedSlots.length > 0 && (
            <span className="text-xs text-gray-500">{sortedSlots.length} {t("timetable.labels.slotsConfigured")}</span>
          )}
        </div>

        {/* Add slot form */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">{t("timetable.fields.startTime")}</label>
              <input
                type="time"
                value={slotForm.startTime}
                onChange={(e) => {
                  setSlotForm((p) => ({ ...p, startTime: e.target.value }));
                  setTimeError("");
                }}
                className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">{t("timetable.fields.endTime")}</label>
              <input
                type="time"
                value={slotForm.endTime}
                onChange={(e) => {
                  setSlotForm((p) => ({ ...p, endTime: e.target.value }));
                  setTimeError("");
                }}
                className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Dropdown
                label={t("timetable.fields.slotType")}
                options={slotTypeOptions}
                selected={slotForm.type}
                onChange={(value) => setSlotForm((p) => ({ ...p, type: value }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 opacity-0">add</label>
              <Button
                onClick={handleAddSlot}
                disabled={!slotForm.startTime || !slotForm.endTime}
              >
                {t("timetable.buttons.addSlot")}
              </Button>
            </div>
          </div>

          {timeError && (
            <p className="mt-2 text-xs text-red-600">{timeError}</p>
          )}
        </div>

        {/* Slot list */}
        {sortedSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
            <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{t("timetable.emptyState.noSlots")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedSlots.map((slot) => {
              const style = SLOT_TYPE_STYLES[slot.type] || SLOT_TYPE_STYLES.class;
              return (
                <div
                  key={slot.id}
                  className="grid gap-3 bg-gray-50 rounded-xl border border-gray-200 p-3 md:grid-cols-4 items-end"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <label className="text-xs font-medium text-gray-600">{t("timetable.fields.startTime")}</label>
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    </div>
                    <input
                      type="time"
                      value={slot.startTime || ""}
                      onChange={(e) => handleUpdateTime(slot, "startTime", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">{t("timetable.fields.endTime")}</label>
                    <input
                      type="time"
                      value={slot.endTime || ""}
                      onChange={(e) => handleUpdateTime(slot, "endTime", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Dropdown
                    label={t("timetable.fields.slotType")}
                    options={slotTypeOptions}
                    selected={slot.type}
                    onChange={(value) => updateSlot(slot.id, { type: value })}
                  />

                  <div className="flex flex-col gap-1">
                    <div className="mb-0.5">
                      <SlotTypeBadge type={slot.type} label={t(`timetable.slotTypes.${slot.type}`)} />
                    </div>
                    <Button variant="danger" onClick={() => removeSlot(slot.id)}>
                      {t("timetable.buttons.delete")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
