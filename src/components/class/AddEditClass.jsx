import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { classSchema } from "../../schemas/class.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createClassApi,
  getClassApi,
  updateClassApi,
} from "../../api/class.api";

function createPayload(form) {
  const { class_id, class_name, class_type, ...extras } = form;
  return { class_id, class_name, class_type, extras };
}

const getSchemaUpdates = (mode) => {
  return {
    class_id: { disabled: mode == 2 ? true : false },
  };
};

function updatedClassSchema(mode) {
  return updateSchema(classSchema, getSchemaUpdates(mode));
}

let _classSchema = classSchema;

export default function AddEditClass({ mode, selectedClass }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _classSchema = updatedClassSchema(mode);
    if (mode !== 2) return;

    getClassApi(selectedClass).then((resp) => {
      const { extras = {}, ...rest } = resp.data;
      const payload = { ...extras, ...rest };
      setFormData(payload);
    });
  }, []);

  function handleUpdateClass() {
    const payload = createPayload(formData);

    updateClassApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateClass() {
    const payload = createPayload(formData);

    createClassApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_classSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateClass();

      case 2:
        return handleUpdateClass();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_classSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
