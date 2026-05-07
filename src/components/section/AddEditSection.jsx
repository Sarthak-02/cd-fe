import React, { useEffect, useRef, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { sectionSchema } from "../../schemas/section.schema";
import { validateForm } from "../../utils/validators/form_validation";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { useSectionStore } from "../../store/section.store";
import { useTimetableStore } from "../../store/timetable.store";
import { useTeacherStore } from "../../store/teacher.store";
import { MODE } from "../../utils/constants/globalConstants";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useCampusStore } from "../../store/campus.store";
import Button from "../../ui-components/Button";
import Dialog from "../../ui-components/Dialog";
import TimetableConfigPanel from "../timetable/TimetableConfigPanel";
import TimetableGrid from "../timetable/TimetableGrid";
import TimetableCellEditor from "../timetable/TimetableCellEditor";
import { useTranslation } from "react-i18next";

function createPayload(form, timetableData) {
  const {
    section_id,
    section_name,
    section_type,
    class_id = "",
    ...extras
  } = form;
  return {
    section_id,
    section_name,
    section_type,
    class_id,
    extras: {
      ...extras,
      timetable: timetableData,
    },
  };
}

const getSchemaUpdates = (mode, classes, subjects = [], teachers = []) => ({
  section_id: { disabled: mode === MODE.EDIT },
  class_id: {
    options: classes.map((c) => ({ value: c.class_id, label: c.class_name })),
  },
  section_subjects: {
    options: subjects.map((subject) => ({ value: subject, label: subject })),
  },
  section_teacher_id: {
    options: teachers.map((t) => ({ value: t.teacher_id, label: t.fullname })),
  },
});

function updatedSectionSchema(mode, classes, subjects, teachers) {
  return updateSchema(sectionSchema, getSchemaUpdates(mode, classes, subjects, teachers));
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditSection({
  mode,
  selectedSection,
  classes = [],
  handleAddEditModel,
  campus_id,
}) {
  const { t } = useTranslation();
  const [schema, setSchema] = useState(() =>
    updatedSectionSchema(MODE.CREATE, [], [])
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  const lastBootstrapKeyRef = useRef("");
  const sectionFetchGenRef = useRef(0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { createSection, updateSection, deleteSection } = useSectionStore();
  const { campusDetails } = useCampusStore();
  const { days, slots, entries } = useTimetableStore();
  const { sectionTeachers } = useTeacherStore();

  useEffect(() => {
    const subjects = campusDetails?.extras?.campus_subjects ?? [];
    const nextSchema = updatedSectionSchema(mode, classes, subjects, sectionTeachers);
    setSchema(nextSchema);

    const bootstrapKey = `${mode}:${selectedSection}:${campus_id}`;

    if (mode === MODE.CREATE) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useSectionStore.getState().clearSectionError();
        setErrors({});
        setFormData(getFieldValuesMap(nextSchema));
        useTimetableStore.getState().resetTimetable();
        useTeacherStore.getState().clearSectionTeachers();
      }
      setBootstrapping(false);
      return;
    }

    if (mode === MODE.EDIT) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useSectionStore.getState().clearSectionError();
        setErrors({});
        setBootstrapping(true);
        setFormData({});
        const gen = ++sectionFetchGenRef.current;
        const sectionIdRequested = selectedSection;
        (async () => {
          await useSectionStore.getState().fetchSectionDetails(sectionIdRequested);
          if (sectionFetchGenRef.current !== gen) return;
          const { sectionDetails: details, error: fetchErr } =
            useSectionStore.getState();
          if (fetchErr) {
            setDetailsLoadError(apiErrorMessage(fetchErr));
          } else if (!details || details.section_id !== sectionIdRequested) {
            setDetailsLoadError("Could not load section.");
          } else {
            setFormData({ ...details, ...(details.extras ?? {}) });
            useTimetableStore.getState().loadTimetable(details.extras?.timetable);
            const resolvedCampusId = campus_id || details.campus_id || campusDetails?.campus_id;
            useTeacherStore.getState().fetchSectionTeachers(sectionIdRequested, resolvedCampusId);
          }
          setBootstrapping(false);
        })();
      }
    }
  }, [mode, selectedSection, campus_id, classes, campusDetails, sectionTeachers]);

  async function onDelete() {
    setDeleteError("");
    const resolved_campus_id =
      campus_id ||
      useSectionStore.getState().sectionDetails?.campus_id ||
      campusDetails?.campus_id;
    try {
      await deleteSection(selectedSection, resolved_campus_id);
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setDeleteError(apiErrorMessage(err));
      setConfirmDelete(false);
    }
  }

  async function onSubmit() {
    const timetableData = { days, slots, entries };
    const { errors, isError } = validateForm(schema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useSectionStore.getState().clearSectionError();

    const base = createPayload(formData, timetableData);
    const resolved_campus_id =
      campus_id || formData.campus_id || campusDetails?.campus_id;
    const payload = { ...base, campus_id: resolved_campus_id };

    if (!payload.campus_id) {
      setSubmitError("Campus is required.");
      return;
    }

    try {
      if (mode === MODE.CREATE) {
        await createSection(payload);
      } else {
        await updateSection(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const showFormSkeleton = bootstrapping && !detailsLoadError;
  const showForm = !bootstrapping && !detailsLoadError;

  return (
    <>
      {submitError && (
        <div
          className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2 mx-4 mt-4"
          role="alert"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {submitError}
        </div>
      )}

      {detailsLoadError && (
        <div
          className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2 mx-4 mt-4"
          role="alert"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {detailsLoadError}
        </div>
      )}

      {showFormSkeleton && (
        <div className="p-4">
          <FormSkeleton />
        </div>
      )}

      {showForm && (
        <div className="w-full p-4 space-y-6">
          {mode === MODE.EDIT && (
            <button
              type="button"
              onClick={() => setIsTimetableOpen(true)}
              className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-4 py-3 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-indigo-800">{t("timetable.title")}</p>
                  <p className="text-xs text-indigo-500">{t("section.buttons.manageTimetable")}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <DynamicForm
            schema={schema}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={onSubmit}
            errors={formErrors}
          />

          {mode === MODE.EDIT && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              {deleteError && (
                <p className="text-sm text-red-600 mb-2">{deleteError}</p>
              )}
              {!confirmDelete ? (
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700 underline"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete Section
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this section? This cannot be undone.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md border border-gray-200 bg-white"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                      onClick={onDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Dialog
        open={isTimetableOpen}
        fullScreen={true}
        onClose={() => setIsTimetableOpen(false)}
        title={t("timetable.title")}
      >
        <div className="space-y-6">
          <TimetableConfigPanel />
          <TimetableGrid />
          <TimetableCellEditor />
        </div>
      </Dialog>
    </>
  );
}
