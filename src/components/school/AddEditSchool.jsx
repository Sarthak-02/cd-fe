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

  const { createSchool, updateSchool } = useSchoolsStore();

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
