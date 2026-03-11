import React, { useEffect, useState } from "react";
import { useTimetableStore } from "../../store/timetable.store";
import Dialog from "../../ui-components/Dialog";
import TextField from "../../ui-components/TextField";
import Button from "../../ui-components/Button";
import { useTranslation } from "react-i18next";

export default function TimetableCellEditor() {
  const { t } = useTranslation();
  
  const {
    editorOpen,
    editingCell,
    closeEditor,
    saveEntry,
    clearEntry,
    getEntry,
  } = useTimetableStore();

  const [form, setForm] = useState({
    subject: "",
    teacher: "",
    room: "",
  });

  useEffect(() => {
    if (!editingCell) return;

    const existing = getEntry(editingCell.dayId, editingCell.slotId);

    setForm({
      subject: existing?.subject || "",
      teacher: existing?.teacher || "",
      room: existing?.room || "",
    });
  }, [editingCell, getEntry]);

  if (!editorOpen || !editingCell) return null;

  const handleSave = () => {
    saveEntry({
      dayId: editingCell.dayId,
      slotId: editingCell.slotId,
      ...form,
    });
  };

  const handleClear = () => {
    clearEntry({
      dayId: editingCell.dayId,
      slotId: editingCell.slotId,
    });
  };

  return (
    <Dialog open={editorOpen} onClose={closeEditor} title={t("timetable.dialog.editCell")}>
      <div className="space-y-4">
        <TextField
          label={t("timetable.fields.subject")}
          placeholder={t("timetable.placeholders.subject")}
          value={form.subject}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, subject: e.target.value }))
          }
        />

        <TextField
          label={t("timetable.fields.teacher")}
          placeholder={t("timetable.placeholders.teacher")}
          value={form.teacher}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, teacher: e.target.value }))
          }
        />

        <TextField
          label={t("timetable.fields.room")}
          placeholder={t("timetable.placeholders.room")}
          value={form.room}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, room: e.target.value }))
          }
        />

        <div className="flex justify-between gap-2 pt-2">
          <Button variant="danger" onClick={handleClear}>
            {t("timetable.buttons.clear")}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={closeEditor}>
              {t("timetable.buttons.cancel")}
            </Button>
            <Button onClick={handleSave}>
              {t("timetable.buttons.save")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}