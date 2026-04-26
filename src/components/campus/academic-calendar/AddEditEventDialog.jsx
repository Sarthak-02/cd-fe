import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "../../../ui-components/Dialog";
import Button from "../../../ui-components/Button";
import {
  useAcademicCalendarStore,
  EVENT_TYPES,
} from "../../../store/academic-calendar.store";

const EMPTY_EVENT = {
  title: "",
  type: "other",
  start_date: "",
  end_date: "",
  description: "",
};

export default function AddEditEventDialog({ open, onClose, event }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(EMPTY_EVENT);
  const [errors, setErrors] = useState({});

  const { addEvent, updateEvent } = useAcademicCalendarStore();
  const isEditing = !!event;

  useEffect(() => {
    if (open) {
      setFormData(event ? { ...event } : { ...EMPTY_EVENT });
      setErrors({});
    }
  }, [open, event]);

  function validate() {
    const errs = {};
    if (!formData.title.trim()) errs.title = t("academicCalendar.errors.titleRequired");
    if (!formData.start_date) errs.start_date = t("academicCalendar.errors.startDateRequired");
    if (!formData.end_date) errs.end_date = t("academicCalendar.errors.endDateRequired");
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date > formData.end_date
    ) {
      errs.end_date = t("academicCalendar.errors.endDateInvalid");
    }
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (isEditing) {
      updateEvent({ ...formData });
    } else {
      addEvent({ ...formData });
    }
    onClose();
  }

  function update(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        isEditing
          ? t("academicCalendar.dialog.editEvent")
          : t("academicCalendar.dialog.addEvent")
      }
    >
      <div className="space-y-4 w-full sm:min-w-96">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("academicCalendar.fields.title")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder={t("academicCalendar.placeholders.title")}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Event Type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("academicCalendar.fields.type")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                type="button"
                onClick={() => update("type", et.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  formData.type === et.value
                    ? "text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
                style={
                  formData.type === et.value
                    ? { backgroundColor: et.color, borderColor: et.color }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      formData.type === et.value ? "white" : et.color,
                  }}
                />
                {t(`academicCalendar.eventTypes.${et.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("academicCalendar.fields.startDate")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => update("start_date", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.start_date ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.start_date && (
              <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("academicCalendar.fields.endDate")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => update("end_date", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.end_date ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.end_date && (
              <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("academicCalendar.fields.description")}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder={t("academicCalendar.placeholders.description")}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            {t("academicCalendar.buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing
              ? t("academicCalendar.buttons.update")
              : t("academicCalendar.buttons.add")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
