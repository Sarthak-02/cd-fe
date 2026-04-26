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
import CampusLocation from "./CampusLocation";
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

  const { createCampus, updateCampus } = useCampusStore();

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

  async function onSubmit() {
    const { errors, isError } = validateForm(schema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useCampusStore.getState().clearCampusError();
    const payload = { ...createPayload(formData) };

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

  const showMap =
    !bootstrapping &&
    !detailsLoadError &&
    formData?.campus_show_map;

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

      {showMainForm && (
        <>
          {mode === MODE.EDIT && (
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCalendarOpen(true)}
              >
                {t("academicCalendar.buttons.manageCalendar")}
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
        </>
      )}

      {showMap && (
        <CampusLocation formData={formData} setFormData={setFormData} />
      )}

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
