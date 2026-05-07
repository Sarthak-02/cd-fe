import React, { useEffect, useState } from "react";
import { classSchema } from "../../schemas/class.schema";
import { useClassStore } from "../../store/class.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";

function createPayload(form) {
  const {
    class_id,
    class_name,
    class_type,
    campus_id,
    class_short_name,
    class_description,
    class_room_no,
    class_teacher_id,
    class_has_sections,
    class_stream,
    class_shift,
    ...extras
  } = form;
  return {
    class_id,
    class_name,
    class_type,
    campus_id,
    class_short_name,
    class_description,
    class_room_no,
    class_teacher_id,
    class_has_sections,
    class_stream,
    class_shift,
    extras,
  };
}

const getSchemaUpdates = (mode) => ({
  class_id: { disabled: mode === MODE.EDIT },
});

function buildClassSchema(mode) {
  return updateSchema(classSchema, getSchemaUpdates(mode));
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditClass({
  mode,
  selectedClass,
  campus_id,
  handleAddEditModel,
}) {
  const [schema, setSchema] = useState(() => buildClassSchema(MODE.CREATE));
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { createClass, updateClass, deleteClass } = useClassStore();

  useEffect(() => {
    let cancelled = false;
    setDetailsLoadError("");
    setSubmitError("");
    setBootstrapping(true);
    useClassStore.getState().clearClassError();

    const nextSchema = buildClassSchema(mode);
    setSchema(nextSchema);
    setErrors({});

    if (mode === MODE.CREATE) {
      setFormData({
        ...getFieldValuesMap(nextSchema),
        ...(campus_id ? { campus_id } : {}),
      });
      setBootstrapping(false);
      return () => {
        cancelled = true;
      };
    }

    if (mode === MODE.EDIT) {
      setFormData({});
      (async () => {
        await useClassStore.getState().fetchClassDetails(selectedClass);
        if (cancelled) return;
        const { classDetails: details, error: fetchErr } =
          useClassStore.getState();
        if (fetchErr) {
          setDetailsLoadError(apiErrorMessage(fetchErr));
        } else if (!details || details.class_id !== selectedClass) {
          setDetailsLoadError("Could not load class.");
        } else {
          setFormData({ ...details, ...(details.extras ?? {}) });
        }
        setBootstrapping(false);
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [mode, selectedClass, campus_id]);

  async function onDelete() {
    setDeleteError("");
    const campus_id = useClassStore.getState().classDetails?.campus_id;
    try {
      await deleteClass(selectedClass, campus_id);
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
    useClassStore.getState().clearClassError();

    const base = createPayload(formData);
    const payload =
      mode === MODE.CREATE ? { ...base, campus_id } : base;

    if (mode === MODE.CREATE && !payload.campus_id) {
      setSubmitError("Campus is required.");
      return;
    }

    try {
      if (mode === MODE.CREATE) {
        await createClass(payload);
      } else {
        await updateClass(payload);
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
                  Delete Class
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this class? This cannot be undone.
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
