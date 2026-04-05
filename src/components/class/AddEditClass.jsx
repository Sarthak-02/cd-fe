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

  const { createClass, updateClass } = useClassStore();

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
