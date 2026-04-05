import React, { useEffect, useRef, useState } from "react";
import { teacherSchema } from "../../schemas/teacher.schema";
import { useTeacherStore } from "../../store/teacher.store";
import DynamicForm from "../../ui-components/DynamicForm";
import { MODE } from "../../utils/constants/globalConstants";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useSectionStore } from "../../store/section.store";
import { useCampusStore } from "../../store/campus.store";

function createPayload(form) {
  const {
    teacher_id,
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id = "",
    teacher_employee_code,
    teacher_photo_url = "",
    ...extras
  } = form;
  return {
    teacher_id,
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob: teacher_dob ? new Date(teacher_dob).toISOString() : null,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id,
    teacher_employee_code,
    teacher_photo_url,
    extras,
  };
}

const getSchemaUpdates = (mode, campusDetails, sections = []) => ({
  teacher_id: { disabled: mode === MODE.EDIT },
  teacher_designation: {
    options:
      campusDetails?.extras?.staff_designations?.map((designation) => ({
        value: designation,
        label: designation,
      })) ?? [],
  },
  teacher_role: {
    options:
      campusDetails?.extras?.staff_roles?.map((role) => ({
        value: role,
        label: role,
      })) ?? [],
  },
  teacher_subjects: {
    options:
      campusDetails?.extras?.campus_subjects?.map((subject) => ({
        label: subject,
        value: subject,
      })) ?? [],
  },
  teacher_sections: {
    options: sections.map(({ section_id = "", section_name = "" }) => ({
      label: section_name,
      value: section_id,
    })),
  },
});

function buildTeacherSchema(mode, campusDetails, sections) {
  return updateSchema(teacherSchema, getSchemaUpdates(mode, campusDetails, sections));
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditTeacher({
  mode,
  selectedTeacher,
  campus_id,
  handleAddEditModel,
}) {
  const [schema, setSchema] = useState(() =>
    buildTeacherSchema(MODE.CREATE, null, [])
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);

  const lastBootstrapKeyRef = useRef("");
  const teacherFetchGenRef = useRef(0);

  const { campusDetails } = useCampusStore();
  const { sections } = useSectionStore();
  const { createTeacher, updateTeacher } = useTeacherStore();

  useEffect(() => {
    const sectionList = sections ?? [];
    const nextSchema = buildTeacherSchema(mode, campusDetails, sectionList);
    setSchema(nextSchema);

    const bootstrapKey = `${mode}:${selectedTeacher}:${campus_id}`;

    if (mode === MODE.CREATE) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useTeacherStore.getState().clearTeacherError();
        setErrors({});
        setFormData({
          ...getFieldValuesMap(nextSchema),
          ...(campus_id ? { campus_id } : {}),
        });
      }
      setBootstrapping(false);
      return;
    }

    if (mode === MODE.EDIT) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useTeacherStore.getState().clearTeacherError();
        setErrors({});
        setBootstrapping(true);
        setFormData({});
        const gen = ++teacherFetchGenRef.current;
        const teacherIdRequested = selectedTeacher;
        (async () => {
          await useTeacherStore
            .getState()
            .fetchTeacherDetails(teacherIdRequested);
          if (teacherFetchGenRef.current !== gen) return;
          const { teacherDetails: details, error: fetchErr } =
            useTeacherStore.getState();
          if (fetchErr) {
            setDetailsLoadError(apiErrorMessage(fetchErr));
          } else if (!details || details.teacher_id !== teacherIdRequested) {
            setDetailsLoadError("Could not load teacher.");
          } else {
            setFormData({ ...details, ...(details.extras ?? {}) });
          }
          setBootstrapping(false);
        })();
      }
    }
  }, [mode, selectedTeacher, campus_id, campusDetails, sections]);

  async function onSubmit() {
    const { errors, isError } = validateForm(schema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useTeacherStore.getState().clearTeacherError();

    const base = createPayload(formData);
    const payload =
      mode === MODE.CREATE ? { ...base, campus_id } : base;

    if (!payload.campus_id) {
      setSubmitError("Campus is required.");
      return;
    }

    try {
      if (mode === MODE.CREATE) {
        await createTeacher(payload);
      } else {
        await updateTeacher(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const showFormSkeleton = bootstrapping && !detailsLoadError;
  const showForm = !bootstrapping && !detailsLoadError;

  return (
    <div className="w-full p-4 space-y-6">
      {submitError && (
        <div
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {detailsLoadError && (
        <div
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm"
          role="alert"
        >
          {detailsLoadError}
        </div>
      )}

      {showFormSkeleton && <FormSkeleton />}

      {showForm && (
        <DynamicForm
          schema={schema}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={onSubmit}
          errors={formErrors}
        />
      )}
    </div>
  );
}
