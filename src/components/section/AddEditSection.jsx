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
  class_id: { options: classes },
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

  const { createSection, updateSection } = useSectionStore();
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
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm mx-4 mt-4"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {detailsLoadError && (
        <div
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm mx-4 mt-4"
          role="alert"
        >
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
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsTimetableOpen(true)}>
                {t("section.buttons.manageTimetable")}
              </Button>
            </div>
          )}

          <DynamicForm
            schema={schema}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={onSubmit}
            errors={formErrors}
          />
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
