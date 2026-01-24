import React, { useEffect, useMemo, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { sectionSchema } from "../../schemas/section.schema";
import { validateForm } from "../../utils/validators/form_validation";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { useSectionStore } from "../../store/section.store";
import { MODE } from "../../utils/constants/globalConstants";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useCampusStore } from "../../store/campus.store";

function createPayload(form) {
  const {
    section_id,
    section_name,
    section_type,
    class_id = "",
    ...extras
  } = form;
  return { section_id, section_name, section_type, class_id, extras };
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
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  const {
    fetchSectionDetails,
    createSection,
    updateSection,
    sectionDetails,
    loadingSectionDetails,
  } = useSectionStore();

  const { campusDetails } = useCampusStore();

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
    const payload = createPayload(formData);
    updateSection(payload, campus_id);
  }

  function handleCreateSection() {
    const payload = createPayload(formData);
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

  return (
    <>
      {loadingSectionDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          <DynamicForm
            schema={_sectionSchema}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={onSubmit}
            errors={formErrors}
          />
        </div>
      )}
    </>
  );
}
