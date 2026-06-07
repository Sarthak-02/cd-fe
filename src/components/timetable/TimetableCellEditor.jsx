import React, { useEffect, useState } from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { useCampusStore } from "../../store/campus.store";
import { useTeacherStore } from "../../store/teacher.store";
import Dialog from "../../ui-components/Dialog";
import TextField from "../../ui-components/TextField";
import Dropdown from "../../ui-components/Dropdown";
import Button from "../../ui-components/Button";
import { useTranslation } from "react-i18next";

const EMPTY_ROW = { subject: "", teacher: "", room: "" };

export default function TimetableCellEditor() {
  const { t } = useTranslation();

  const { editorOpen, editingCell, days, slots, closeEditor, saveEntry, clearEntry, getEntry } =
    useTimetableStore();

  const campusDetails = useCampusStore((s) => s.campusDetails);
  const rawSubjects = campusDetails?.extras?.campus_subjects ?? [];
  const subjectOptions = rawSubjects.map((s) => ({ value: s, label: s }));

  const sectionTeachers = useTeacherStore((s) => s.sectionTeachers);
  const teacherOptions = sectionTeachers.map((t) => ({
    value: t.fullname,
    label: t.fullname,
  }));

  const [form, setForm] = useState({ subject: "", teacher: "", room: "" });
  const [electiveRows, setElectiveRows] = useState([{ ...EMPTY_ROW }]);

  const slot = slots.find((s) => s.id === editingCell?.slotId);
  const isElective = slot?.type === "elective";

  useEffect(() => {
    if (!editingCell) return;
    const existing = getEntry(editingCell.dayId, editingCell.slotId);
    if (isElective) {
      setElectiveRows(
        existing?.electives?.length ? existing.electives : [{ ...EMPTY_ROW }]
      );
    } else {
      setForm({
        subject: existing?.subject || "",
        teacher: existing?.teacher || "",
        room:    existing?.room    || "",
      });
    }
  }, [editingCell, isElective, getEntry]);

  if (!editorOpen || !editingCell) return null;

  const day     = days.find((d) => d.id === editingCell.dayId);
  const hasEntry = !!getEntry(editingCell.dayId, editingCell.slotId);

  const dialogTitle = day && slot
    ? `${day.label} — ${slot.label || t("timetable.placeholders.untitledSlot")}`
    : t("timetable.dialog.editCell");

  const handleSave = () => {
    if (isElective) {
      const filled = electiveRows.filter((r) => r.subject.trim());
      saveEntry({
        dayId: editingCell.dayId,
        slotId: editingCell.slotId,
        isElective: true,
        electives: filled,
      });
    } else {
      saveEntry({ dayId: editingCell.dayId, slotId: editingCell.slotId, ...form });
    }
  };

  const handleClear = () => {
    clearEntry({ dayId: editingCell.dayId, slotId: editingCell.slotId });
  };

  const updateRow = (index, field, value) => {
    setElectiveRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => setElectiveRows((rows) => [...rows, { ...EMPTY_ROW }]);

  const removeRow = (index) =>
    setElectiveRows((rows) => rows.filter((_, i) => i !== index));

  const canSave = isElective
    ? electiveRows.some((r) => r.subject.trim())
    : !!form.subject.trim();

  return (
    <Dialog open={editorOpen} onClose={closeEditor} title={dialogTitle}>
      <div className="space-y-4">
        {slot && (
          <p className="text-xs text-gray-500 -mt-1 capitalize">
            {t(`timetable.slotTypes.${slot.type}`)}
          </p>
        )}

        {isElective ? (
          <div className="space-y-3">
            <p className="text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
              {t("timetable.elective.hint")}
            </p>

            {electiveRows.map((row, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {t("timetable.elective.header")} {index + 1}
                  </span>
                  {electiveRows.length > 1 && (
                    <button
                      onClick={() => removeRow(index)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      {t("timetable.buttons.removeElective")}
                    </button>
                  )}
                </div>

                {subjectOptions.length > 0 ? (
                  <Dropdown
                    label={t("timetable.fields.subject")}
                    options={subjectOptions}
                    selected={row.subject}
                    onChange={(value) => updateRow(index, "subject", value)}
                    placeholder={t("timetable.placeholders.subject")}
                  />
                ) : (
                  <TextField
                    label={t("timetable.fields.subject")}
                    placeholder={t("timetable.placeholders.subject")}
                    value={row.subject}
                    onChange={(e) => updateRow(index, "subject", e.target.value)}
                  />
                )}

                {teacherOptions.length > 0 ? (
                  <Dropdown
                    label={t("timetable.fields.teacher")}
                    options={teacherOptions}
                    selected={row.teacher}
                    onChange={(value) => updateRow(index, "teacher", value)}
                    placeholder={t("timetable.placeholders.teacher")}
                  />
                ) : (
                  <TextField
                    label={t("timetable.fields.teacher")}
                    placeholder={t("timetable.placeholders.teacher")}
                    value={row.teacher}
                    onChange={(e) => updateRow(index, "teacher", e.target.value)}
                  />
                )}

                <TextField
                  label={t("timetable.fields.room")}
                  placeholder={t("timetable.placeholders.room")}
                  value={row.room}
                  onChange={(e) => updateRow(index, "room", e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={addRow}
              className="w-full border border-dashed border-orange-300 rounded-xl py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors font-medium"
            >
              + {t("timetable.buttons.addElective")}
            </button>
          </div>
        ) : (
          <>
            {subjectOptions.length > 0 ? (
              <Dropdown
                label={t("timetable.fields.subject")}
                options={subjectOptions}
                selected={form.subject}
                onChange={(value) => setForm((p) => ({ ...p, subject: value }))}
                placeholder={t("timetable.placeholders.subject")}
              />
            ) : (
              <TextField
                label={t("timetable.fields.subject")}
                placeholder={t("timetable.placeholders.subject")}
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              />
            )}

            {teacherOptions.length > 0 ? (
              <Dropdown
                label={t("timetable.fields.teacher")}
                options={teacherOptions}
                selected={form.teacher}
                onChange={(value) => setForm((p) => ({ ...p, teacher: value }))}
                placeholder={t("timetable.placeholders.teacher")}
              />
            ) : (
              <TextField
                label={t("timetable.fields.teacher")}
                placeholder={t("timetable.placeholders.teacher")}
                value={form.teacher}
                onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))}
              />
            )}

            <TextField
              label={t("timetable.fields.room")}
              placeholder={t("timetable.placeholders.room")}
              value={form.room}
              onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
            />
          </>
        )}

        <div className="flex justify-between gap-2 pt-2">
          <Button variant="danger" onClick={handleClear} disabled={!hasEntry}>
            {t("timetable.buttons.clear")}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={closeEditor}>
              {t("timetable.buttons.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              {t("timetable.buttons.save")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
