import React, { useEffect, useState } from "react";

import { schoolSchema } from "../../schemas/school.schema";
import { useSchoolsStore } from "../../store/school.store";

import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";

import { MODE } from "../../utils/constants/globalConstants";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";

const getSchemaUpdates = (mode) => ({
  school_id: { disabled: mode === MODE.EDIT },
});

function buildSchoolSchema(mode) {
  return updateSchema(schoolSchema, getSchemaUpdates(mode));
}

function createPayload(form) {
  const { school_id, school_name, school_type, ...extras } = form;
  return { school_id, school_name, school_type, extras };
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditSchool({
  mode,
  selectedSchool,
  handleAddEditModel,
}) {
  const [schema, setSchema] = useState(() =>
    buildSchoolSchema(MODE.CREATE)
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { createSchool, updateSchool, deleteSchool } = useSchoolsStore();

  useEffect(() => {
    let cancelled = false;
    setDetailsLoadError("");
    setSubmitError("");
    setBootstrapping(true);
    useSchoolsStore.getState().clearSchoolError();

    const nextSchema = buildSchoolSchema(mode);
    setSchema(nextSchema);
    setErrors({});

    if (mode === MODE.CREATE) {
      setFormData(getFieldValuesMap(nextSchema));
      setBootstrapping(false);
      return () => {
        cancelled = true;
      };
    }

    if (mode === MODE.EDIT) {
      setFormData({});
      (async () => {
        await useSchoolsStore.getState().fetchSchoolDetails(selectedSchool);
        if (cancelled) return;
        const { schoolDetails: details, error: fetchErr } =
          useSchoolsStore.getState();
        if (fetchErr) {
          setDetailsLoadError(apiErrorMessage(fetchErr));
        } else if (!details || details.school_id !== selectedSchool) {
          setDetailsLoadError("Could not load school.");
        } else {
          setFormData({ ...details, ...(details.extras ?? {}) });
        }
        setBootstrapping(false);
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [mode, selectedSchool]);

  async function onDelete() {
    setDeleteError("");
    try {
      await deleteSchool(selectedSchool);
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
    useSchoolsStore.getState().clearSchoolError();
    const payload = createPayload(formData);

    try {
      if (mode === MODE.CREATE) {
        await createSchool(payload);
      } else {
        await updateSchool(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const showFormSkeleton = bootstrapping && !detailsLoadError;

  const showForm =
    !bootstrapping && !detailsLoadError;

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
                  Delete School
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this school? This cannot be undone.
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
