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

function createPayload(form) {
  const { campus_id, campus_name, campus_type, ...extras } = form;
  return { campus_id, campus_name, campus_type, extras };
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

export default function AddEditCampus({ mode, selectedCampus , school_id }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _campusSchema = updatedCampusSchema(mode);
    if (mode !== 2) return;

    getCampusApi(selectedCampus).then((resp) => {
      const { extras = {}, ...rest } = resp.data;
      const payload = { ...extras, ...rest };
      setFormData(payload);
    });
  }, []);

  function handleUpdateCampus() {
    const payload = { ...createPayload(formData), school_id: school_id };

    updateCampusApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateCampus() {
    const payload = { ...createPayload(formData), school_id: school_id };

    createCampusApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_campusSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateCampus();

      case 2:
        return handleUpdateCampus();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_campusSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
