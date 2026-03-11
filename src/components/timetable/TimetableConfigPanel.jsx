import React, { useState } from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { sortByOrder, buildSlotLabel } from "../../utils/utility_functions/timetableHelpers";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";
import { useTranslation } from "react-i18next";

export default function TimetableConfigPanel() {
  const { t } = useTranslation();
  
  const {
    slots,
    addSlot,
    updateSlot,
    removeSlot,
  } = useTimetableStore();

  const [slotForm, setSlotForm] = useState({
    startTime: "",
    endTime: "",
    type: "class",
  });

  const sortedSlots = sortByOrder(slots);

  const slotTypeOptions = [
    { label: t("timetable.slotTypes.class"), value: "class" },
    { label: t("timetable.slotTypes.break"), value: "break" },
    { label: t("timetable.slotTypes.lunch"), value: "lunch" },
    { label: t("timetable.slotTypes.assembly"), value: "assembly" },
  ];

  const handleAddSlot = () => {
    if (!slotForm.startTime.trim() || !slotForm.endTime.trim()) return;
    const label = buildSlotLabel(slotForm.startTime, slotForm.endTime);

    addSlot({
      label,
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      type: slotForm.type,
    });

    setSlotForm({
      startTime: "",
      endTime: "",
      type: "class",
    });
  };

  return (
    <div className="grid gap-4">
      <div className="bg-white shadow-sm rounded-2xl p-4 border">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("timetable.sections.timeSlots")}</h2>

        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{t("timetable.fields.startTime")}</label>
            <input
              type="time"
              value={slotForm.startTime}
              onChange={(e) =>
                setSlotForm((prev) => ({ ...prev, startTime: e.target.value }))
              }
              className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{t("timetable.fields.endTime")}</label>
            <input
              type="time"
              value={slotForm.endTime}
              onChange={(e) =>
                setSlotForm((prev) => ({ ...prev, endTime: e.target.value }))
              }
              className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Dropdown
              label={t("timetable.fields.slotType")}
              options={slotTypeOptions}
              selected={slotForm.type}
              onChange={(value) =>
                setSlotForm((prev) => ({ ...prev, type: value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 opacity-0">{t("timetable.buttons.add")}</label>
            <Button
              onClick={handleAddSlot}
              disabled={!slotForm.startTime.trim() || !slotForm.endTime.trim()}
            >
              {t("timetable.buttons.addSlot")}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedSlots.map((slot) => (
            <div
              key={slot.id}
              className="grid gap-3 bg-gray-50 rounded-xl border border-gray-200 p-3 md:grid-cols-4 items-end"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{t("timetable.fields.startTime")}</label>
                <input
                  type="time"
                  value={slot.startTime || ""}
                  onChange={(e) =>
                    updateSlot(slot.id, {
                      startTime: e.target.value,
                      label: buildSlotLabel(e.target.value, slot.endTime),
                    })
                  }
                  className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{t("timetable.fields.endTime")}</label>
                <input
                  type="time"
                  value={slot.endTime || ""}
                  onChange={(e) =>
                    updateSlot(slot.id, {
                      endTime: e.target.value,
                      label: buildSlotLabel(slot.startTime, e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Dropdown
                label={t("timetable.fields.slotType")}
                options={slotTypeOptions}
                selected={slot.type}
                onChange={(value) =>
                  updateSlot(slot.id, { type: value })
                }
              />

              <Button
                variant="danger"
                onClick={() => removeSlot(slot.id)}
              >
                {t("timetable.buttons.delete")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}