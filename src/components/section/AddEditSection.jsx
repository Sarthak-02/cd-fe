import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { sectionSchema } from "../../schemas/section.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createSectionApi,
  getSectionApi,
  updateSectionApi,
} from "../../api/section.api";

function createPayload(form) {
  const { section_id, section_name, section_type, ...extras } = form;
  return { section_id, section_name, section_type, extras };
}

const getSchemaUpdates = (mode) => {
  return {
    section_id: { disabled: mode == 2 ? true : false },
  };
};

function updatedSectionSchema(mode) {
  return updateSchema(sectionSchema, getSchemaUpdates(mode));
}

let _sectionSchema = sectionSchema;

export default function AddEditSection({ mode, selectedSection }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _sectionSchema = updatedSectionSchema(mode);
    if (mode !== 2) return;

    getSectionApi(selectedSection).then((resp) => {
      const { extras = {}, ...rest } = resp.data;
      const payload = { ...extras, ...rest };
      setFormData(payload);
    });
  }, []);

  function handleUpdateSection() {
    const payload = createPayload(formData);

    updateSectionApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateSection() {
    const payload = createPayload(formData);

    createSectionApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_sectionSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateSection();

      case 2:
        return handleUpdateSection();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_sectionSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
