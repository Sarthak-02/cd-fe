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

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { campusDetails } = useCampusStore();
  const { sections } = useSectionStore();
  const { createTeacher, updateTeacher, deleteTeacher } = useTeacherStore();

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

  async function onDelete() {
    setDeleteError("");
    const resolvedCampusId =
      campus_id ||
      useTeacherStore.getState().teacherDetails?.campus_id;
    try {
      await deleteTeacher(selectedTeacher, resolvedCampusId);
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setDeleteError(apiErrorMessage(err));
      setConfirmDelete(false);
    }
  }

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
          className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2"
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
          className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2"
          role="alert"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {detailsLoadError}
        </div>
      )}

      {showFormSkeleton && <FormSkeleton />}

      {showForm && (
        <>
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
                  Delete Teacher
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this teacher? This cannot be undone.
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
        </>
      )}
    </div>
  );
}
