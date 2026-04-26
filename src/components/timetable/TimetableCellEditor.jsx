import React, { useEffect, useState } from "react";
import { useTimetableStore } from "../../store/timetable.store";
import { useSectionStore } from "../../store/section.store";
import Dialog from "../../ui-components/Dialog";
import TextField from "../../ui-components/TextField";
import Dropdown from "../../ui-components/Dropdown";
import Button from "../../ui-components/Button";
import { useTranslation } from "react-i18next";

export default function TimetableCellEditor() {
  const { t } = useTranslation();

  const { editorOpen, editingCell, days, slots, closeEditor, saveEntry, clearEntry, getEntry } =
    useTimetableStore();

  const sectionDetails = useSectionStore((s) => s.sectionDetails);
  const rawSubjects = sectionDetails?.extras?.section_subjects ?? [];
  const subjectOptions = rawSubjects.map((s) => ({ value: s, label: s }));

  const [form, setForm] = useState({ subject: "", teacher: "", room: "" });

  useEffect(() => {
    if (!editingCell) return;
    const existing = getEntry(editingCell.dayId, editingCell.slotId);
    setForm({
      subject: existing?.subject || "",
      teacher: existing?.teacher || "",
      room:    existing?.room    || "",
    });
  }, [editingCell, getEntry]);

  if (!editorOpen || !editingCell) return null;

  const day  = days.find((d) => d.id === editingCell.dayId);
  const slot = slots.find((s) => s.id === editingCell.slotId);
  const hasEntry = !!getEntry(editingCell.dayId, editingCell.slotId);

  const dialogTitle = day && slot
    ? `${day.label} — ${slot.label || t("timetable.placeholders.untitledSlot")}`
    : t("timetable.dialog.editCell");

  const handleSave = () => {
    saveEntry({ dayId: editingCell.dayId, slotId: editingCell.slotId, ...form });
  };

  const handleClear = () => {
    clearEntry({ dayId: editingCell.dayId, slotId: editingCell.slotId });
  };

  return (
    <Dialog open={editorOpen} onClose={closeEditor} title={dialogTitle}>
      <div className="space-y-4">
        {slot && (
          <p className="text-xs text-gray-500 -mt-1 capitalize">
            {t(`timetable.slotTypes.${slot.type}`)}
          </p>
        )}

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

        <TextField
          label={t("timetable.fields.teacher")}
          placeholder={t("timetable.placeholders.teacher")}
          value={form.teacher}
          onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))}
        />

        <TextField
          label={t("timetable.fields.room")}
          placeholder={t("timetable.placeholders.room")}
          value={form.room}
          onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
        />

        <div className="flex justify-between gap-2 pt-2">
          <Button variant="danger" onClick={handleClear} disabled={!hasEntry}>
            {t("timetable.buttons.clear")}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={closeEditor}>
              {t("timetable.buttons.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!form.subject.trim()}>
              {t("timetable.buttons.save")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
