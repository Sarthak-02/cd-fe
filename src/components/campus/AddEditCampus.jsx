import React, { useEffect, useState } from "react";
import { campusSchema } from "../../schemas/campus.schema";
import { useCampusStore } from "../../store/campus.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";
import { getLocation } from "../../utils/map/getLocation";
// import CampusLocation from "./CampusLocation";
import Button from "../../ui-components/Button";
import Dialog from "../../ui-components/Dialog";
import AcademicCalendarPanel from "./academic-calendar/AcademicCalendarPanel";
import { useTranslation } from "react-i18next";

function createPayload(form) {
  const {
    campus_id,
    campus_name,
    campus_type,
    school_id = "",
    extras: _rawExtras, // exclude the nested extras object that comes from { ...details, ...details.extras }
    ...extras
  } = form;
  return { campus_id, campus_name, campus_type, school_id, extras };
}

const getSchemaUpdates = (mode, latitude, longitude) => {
  return {
    campus_id: { disabled: mode === MODE.EDIT },
    campus_latitude: mode === MODE.CREATE ? { value: latitude } : {},
    campus_longitude: mode === MODE.CREATE ? { value: longitude } : {},
    campus_radius: mode === MODE.CREATE ? { value: 100 } : {},
  };
};

async function buildCampusSchema(mode) {
  let latitude;
  let longitude;
  try {
    const pos = await getLocation();
    latitude = pos.latitude;
    longitude = pos.longitude;
  } catch {
    latitude = undefined;
    longitude = undefined;
  }
  return updateSchema(campusSchema, getSchemaUpdates(mode, latitude, longitude));
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditCampus({
  mode,
  handleAddEditModel,
  selectedCampus,
  school_id,
}) {
  const { t } = useTranslation();
  const [schema, setSchema] = useState(campusSchema);
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { createCampus, updateCampus, deleteCampus } = useCampusStore();

  useEffect(() => {
    let cancelled = false;
    setDetailsLoadError("");
    setSubmitError("");
    setBootstrapping(true);
    useCampusStore.getState().clearCampusError();

    (async () => {
      const nextSchema = await buildCampusSchema(mode);
      if (cancelled) return;
      setSchema(nextSchema);
      setErrors({});

      if (mode === MODE.CREATE) {
        setFormData(getFieldValuesMap(nextSchema));
        setBootstrapping(false);
        return;
      }

      if (mode === MODE.EDIT) {
        setFormData({});
        await useCampusStore.getState().fetchCampusDetails(selectedCampus);
        if (cancelled) return;
        const { campusDetails: details, error: fetchErr } =
          useCampusStore.getState();
        if (fetchErr) {
          setDetailsLoadError(apiErrorMessage(fetchErr));
        } else if (!details || details.campus_id !== selectedCampus) {
          setDetailsLoadError("Could not load campus.");
        } else {
          setFormData({ ...details, ...(details.extras ?? {}) });
        }
        setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, selectedCampus]);

  async function handleCalendarSave(calendarData) {
    const currentExtras = useCampusStore.getState().campusDetails?.extras ?? {};
    const payload = {
      campus_id: selectedCampus,
      extras: { ...currentExtras, academic_calendar: calendarData },
    };
    try {
      await updateCampus(payload);
      setIsCalendarOpen(false);
    } catch (err) {
      // error is stored in the campus store
    }
  }

  async function onDelete() {
    setDeleteError("");
    try {
      await deleteCampus(selectedCampus);
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
    useCampusStore.getState().clearCampusError();
    const payload = createPayload(formData);

    // Preserve academic_calendar from the store — it's managed separately via the Calendar
    // panel and formData can be stale (loaded before the calendar was saved).
    if (mode === MODE.EDIT) {
      const latestCalendar =
        useCampusStore.getState().campusDetails?.extras?.academic_calendar;
      if (latestCalendar !== undefined) {
        payload.extras.academic_calendar = latestCalendar;
      }
    }

    try {
      if (mode === MODE.CREATE) {
        await createCampus({ ...payload, school_id });
      } else {
        await updateCampus(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const showFormSkeleton =
    bootstrapping && !detailsLoadError;

  const showMainForm =
    !bootstrapping &&
    !detailsLoadError &&
    !formData?.campus_show_map;

  // const showMap =
  //   !bootstrapping &&
  //   !detailsLoadError &&
  //   formData?.campus_show_map;

  return (
    <div className="w-full p-4 pb-12 space-y-6">
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

      {showMainForm && (
        <>
          {mode === MODE.EDIT && (
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-4 py-3 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-blue-800">{t("academicCalendar.title")}</p>
                  <p className="text-xs text-blue-500">{t("academicCalendar.buttons.manageCalendar")}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                  Delete Campus
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this campus? This cannot be undone.
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

      {/* showMap && (
        <CampusLocation formData={formData} setFormData={setFormData} />
      ) */}

      <Dialog
        open={isCalendarOpen}
        fullScreen={true}
        onClose={() => setIsCalendarOpen(false)}
        title={t("academicCalendar.title")}
      >
        <AcademicCalendarPanel
          campusExtras={
            useCampusStore.getState().campusDetails?.extras ?? {}
          }
          onSave={handleCalendarSave}
        />
      </Dialog>
    </div>
  );
}
