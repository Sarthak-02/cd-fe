import React, { useEffect, useRef, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { admissionSchema, pickAdmissionExtras } from "../../schemas/admission.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { getFieldValuesMap, updateSchema } from "../../utils/utility_functions/updateSchema";
import { MODE } from "../../utils/constants/globalConstants";

import { useAdmissionStore } from "../../store/admission.store";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useClassStore } from "../../store/class.store";

/** Aligns with admissionCreateRequestSchema / admissionUpdateRequestSchema (extras = allowed keys only). */
function createPayload(form) {
  const extras = pickAdmissionExtras(form);

  const payload = {
    admission_application_no: form.admission_application_no,
    admission_academic_year: form.admission_academic_year,
    admission_date: form.admission_date ? new Date(form.admission_date).toISOString() : null,
    admission_applied_class_id: form.admission_applied_class_id,
    admission_status: form.admission_status,
    admission_first_name: form.admission_first_name,
    admission_middle_name: form.admission_middle_name ?? null,
    admission_last_name: form.admission_last_name ?? null,
    admission_gender: form.admission_gender,
    admission_dob: form.admission_dob ? new Date(form.admission_dob).toISOString() : null,
    campus_id: form.campus_id,
    extras,
  };

  if (form.admission_id) {
    payload.admission_id = form.admission_id;
  }

  return payload;
}

function buildAdmissionSchema(classes) {
  return updateSchema(admissionSchema, {
    admission_applied_class_id: {
      options: (classes ?? []).map(({ class_name, class_id }) => ({
        label: class_name,
        value: class_id,
      })),
    },
  });
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditAdmission({ mode, selectedAdmission, campus_id, handleAddEditModel }) {
  const [schema, setSchema] = useState(() => buildAdmissionSchema([]));
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);

  const lastBootstrapKeyRef = useRef("");
  const admissionFetchGenRef = useRef(0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [convertSuccess, setConvertSuccess] = useState(false);

  const { classes } = useClassStore();
  const { createAdmission, updateAdmission, deleteAdmission, convertToStudent } = useAdmissionStore();

  useEffect(() => {
    const nextSchema = buildAdmissionSchema(classes);
    setSchema(nextSchema);

    const bootstrapKey = `${mode}:${selectedAdmission}:${campus_id}`;

    if (mode === MODE.CREATE) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useAdmissionStore.getState().clearAdmissionError();
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
        useAdmissionStore.getState().clearAdmissionError();
        setErrors({});
        setBootstrapping(true);
        setFormData({});
        const gen = ++admissionFetchGenRef.current;
        const idRequested = selectedAdmission;
        (async () => {
          await useAdmissionStore.getState().fetchAdmissionDetails(idRequested);
          if (admissionFetchGenRef.current !== gen) return;
          const { admissionDetails: details, error: fetchErr } = useAdmissionStore.getState();
          if (fetchErr) {
            setDetailsLoadError(apiErrorMessage(fetchErr));
          } else if (!details || details.admission_id !== idRequested) {
            setDetailsLoadError("Could not load admission.");
          } else {
            setFormData({ ...details, ...(details.extras ?? {}) });
          }
          setBootstrapping(false);
        })();
      }
    }
  }, [mode, selectedAdmission, campus_id, classes]);

  async function onDelete() {
    setDeleteError("");
    const resolvedCampusId = campus_id || useAdmissionStore.getState().admissionDetails?.campus_id;
    try {
      await deleteAdmission(selectedAdmission, resolvedCampusId);
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setDeleteError(apiErrorMessage(err));
      setConfirmDelete(false);
    }
  }

  async function onConvertToStudent() {
    setConvertError("");
    setConverting(true);
    const resolvedCampusId = campus_id || useAdmissionStore.getState().admissionDetails?.campus_id;
    try {
      await convertToStudent(selectedAdmission, resolvedCampusId);
      setConvertSuccess(true);
    } catch (err) {
      setConvertError(apiErrorMessage(err));
    } finally {
      setConverting(false);
    }
  }

  async function onSubmit() {
    const { errors, isError } = validateForm(schema, formData);
    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useAdmissionStore.getState().clearAdmissionError();

    const base = createPayload(formData);
    const payload = mode === MODE.CREATE ? { ...base, campus_id } : base;

    if (!payload.campus_id) {
      setSubmitError("Campus is required.");
      return;
    }

    try {
      if (mode === MODE.CREATE) {
        await createAdmission(payload);
      } else {
        await updateAdmission(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const isApproved = formData.admission_status === "approved";
  const showFormSkeleton = bootstrapping && !detailsLoadError;
  const showForm = !bootstrapping && !detailsLoadError;

  return (
    <div className="w-full p-4 space-y-6">
      {submitError && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2" role="alert">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {submitError}
        </div>
      )}

      {detailsLoadError && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex items-start gap-2" role="alert">
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
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">

              {/* Convert to Student */}
              <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                <p className="text-sm font-medium text-green-800 mb-1">Convert to Student</p>
                <p className="text-xs text-green-600 mb-3">
                  {isApproved
                    ? "This application is approved. You can enrol the applicant as a student."
                    : "Set the status to Approved to enable enrolment."}
                </p>
                {convertSuccess && (
                  <p className="text-sm text-green-700 font-medium mb-2">Student record created successfully.</p>
                )}
                {convertError && (
                  <p className="text-sm text-red-600 mb-2">{convertError}</p>
                )}
                <button
                  type="button"
                  disabled={!isApproved || converting || convertSuccess}
                  onClick={onConvertToStudent}
                  className="text-sm font-medium px-4 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {converting ? "Converting…" : convertSuccess ? "Enrolled" : "Convert to Student"}
                </button>
              </div>

              {/* Delete */}
              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
              )}
              {!confirmDelete ? (
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700 underline"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete Admission
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this application? This cannot be undone.
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
