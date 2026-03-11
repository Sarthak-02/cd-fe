import React, { useEffect, useMemo, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { sectionSchema } from "../../schemas/section.schema";
import { validateForm } from "../../utils/validators/form_validation";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { useSectionStore } from "../../store/section.store";
import { useTimetableStore } from "../../store/timetable.store";
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
      timetable: timetableData
    }
  };
}

const getSchemaUpdates = (mode, classes, subjects = []) => {
  return {
    section_id: { disabled: mode == 2 ? true : false },
    class_id: { options: classes },
    section_subjects: {
      options: subjects.map((subject) => ({ value: subject, label: subject })),
    },
  };
};

function updatedSectionSchema(mode, classes, subjects) {
  return updateSchema(sectionSchema, getSchemaUpdates(mode, classes, subjects));
}

export default function AddEditSection({
  mode,
  selectedSection,
  classes = [],
  handleAddEditModel,
  campus_id,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  const {
    fetchSectionDetails,
    createSection,
    updateSection,
    sectionDetails,
    loadingSectionDetails,
  } = useSectionStore();

  const { campusDetails } = useCampusStore();
  
  const { days, slots, entries } = useTimetableStore();

  useEffect(() => {
    function getSectionSchema() {
      const _sectionSchema = updatedSectionSchema(
        mode,
        classes,
        campusDetails?.extras?.campus_subjects
      );
      if (mode === MODE.CREATE) {
        setFormData(getFieldValuesMap(_sectionSchema));
      }
    }
    getSectionSchema();
    if (mode === MODE.EDIT) fetchSectionDetails(selectedSection);
  }, []);

  let _sectionSchema = useMemo(() => {
    if (classes.length === 0) {
      return sectionSchema;
    }

    return updatedSectionSchema(mode, classes,campusDetails?.extras?.campus_subjects);
  }, [classes, sectionSchema, mode]);

  if (
    mode === MODE.EDIT &&
    sectionDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...sectionDetails, ...sectionDetails?.extras });
  }

  function handleUpdateSection() {
    const timetableData = { days, slots, entries };
    const payload = createPayload(formData, timetableData);
    updateSection(payload, campus_id);
  }

  function handleCreateSection() {
    const timetableData = { days, slots, entries };
    const payload = createPayload(formData, timetableData);
    createSection(payload, campus_id);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_sectionSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) {
      handleCreateSection();
    }

    if (mode === MODE.EDIT) {
      handleUpdateSection();
    }

    handleAddEditModel(MODE.NONE);
  }

  function handleOpenTimetable() {
    setIsTimetableOpen(true);
  }

  function handleCloseTimetable() {
    setIsTimetableOpen(false);
  }

  return (
    <>
      {loadingSectionDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          {mode === MODE.EDIT && (
            <div className="flex justify-end mb-4">
              <Button onClick={handleOpenTimetable}>
                {t("section.buttons.manageTimetable")}
              </Button>
            </div>
          )}
          
          <DynamicForm
            schema={_sectionSchema}
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
        onClose={handleCloseTimetable}
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
