import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { campusSchema } from "../../schemas/campus.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createCampusApi,
  getCampusApi,
  updateCampusApi,
} from "../../api/campus.api";
import { MODE } from "../../utils/constants/globalConstants";
import { useCampusStore } from "../../store/campus.store";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";

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

const getSchemaUpdates = (mode) => {
  return {
    campus_id: { disabled: mode == 2 ? true : false },
  };
};

function updatedCampusSchema(mode) {
  return updateSchema(campusSchema, getSchemaUpdates(mode));
}

let _campusSchema = campusSchema;

export default function AddEditCampus({
  mode,
  handleAddEditModel,
  selectedCampus,
  school_id,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const {
    campusDetails,
    loadingCampusDetails,
    fetchCampusDetails,
    createCampus,
    updateCampus,
  } = useCampusStore();

  if (
    mode === MODE.EDIT &&
    campusDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...campusDetails, ...campusDetails?.extras });
  }

  useEffect(() => {
    _campusSchema = updatedCampusSchema(mode);
    if (mode !== 2) return;

    fetchCampusDetails(selectedCampus);
  }, []);

  function handleUpdateCampus() {
    const payload = { ...createPayload(formData) };

    updateCampus(payload);
  }

  function handleCreateCampus() {
    const payload = { ...createPayload(formData), school_id: school_id };

    createCampus(payload);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_campusSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) {
      handleCreateCampus();
    }

    if (mode === MODE.EDIT) {
      handleUpdateCampus();
    }

    handleAddEditModel(MODE.NONE);
  }

  return (
    <>
      {loadingCampusDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          <DynamicForm
            schema={_campusSchema}
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
