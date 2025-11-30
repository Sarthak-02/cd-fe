import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { schoolSchema } from "../../schemas/school.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createSchoolApi,
  getSchoolApi,
  updateSchoolApi,
} from "../../api/school.api";


function createPayload(form){
  const {school_id,school_name, school_type,...extras} = form
  return {school_id,school_name,school_type,extras};
}

const getSchemaUpdates = (mode) => {
  return {
    school_id: { disabled: mode == 2 ? true : false },
  };
};
function updatedSchoolSchema(mode) {
  return updateSchema(schoolSchema, getSchemaUpdates(mode));
}

let _schoolSchema = schoolSchema;

export default function AddEditSchool({ mode, selectedSchool }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _schoolSchema = updatedSchoolSchema(mode);
    if (mode !== 2) return;

    getSchoolApi(selectedSchool).then((resp) => {
      const {extras = {} ,...rest} = resp.data
      const payload = {...extras,...rest}
      setFormData(payload);
    });
  }, []);

  function handleUpdateSchool() {
    const payload = createPayload(formData)

    updateSchoolApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateSchool() {
    const payload = createPayload(formData)

    createSchoolApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_schoolSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      //show an error pop up and highlight all the missed fields
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateSchool();

      case 2:
        return handleUpdateSchool();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_schoolSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
