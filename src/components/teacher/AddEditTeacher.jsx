import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { teacherSchema } from "../../schemas/teacher.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createTeacherApi,
  getTeacherApi,
  updateTeacherApi,
} from "../../api/teacher.api";

function createPayload(form) {
  const { teacher_id, teacher_name, teacher_type, ...extras } = form;
  return { teacher_id, teacher_name, teacher_type, extras };
}

const getSchemaUpdates = (mode) => {
  return {
    teacher_id: { disabled: mode == 2 ? true : false },
  };
};

function updatedTeacherSchema(mode) {
  return updateSchema(teacherSchema, getSchemaUpdates(mode));
}

let _teacherSchema = teacherSchema;

export default function AddEditTeacher({ mode, selectedTeacher }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _teacherSchema = updatedTeacherSchema(mode);
    if (mode !== 2) return;

    getTeacherApi(selectedTeacher).then((resp) => {
      const { extras = {}, ...rest } = resp.data;
      const payload = { ...extras, ...rest };
      setFormData(payload);
    });
  }, []);

  function handleUpdateTeacher() {
    const payload = createPayload(formData);

    updateTeacherApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateTeacher() {
    const payload = createPayload(formData);

    createTeacherApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_teacherSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateTeacher();

      case 2:
        return handleUpdateTeacher();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_teacherSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
