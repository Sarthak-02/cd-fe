import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { studentSchema } from "../../schemas/student.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import {
  createStudentApi,
  getStudentApi,
  updateStudentApi,
} from "../../api/student.api";

function createPayload(form) {
  const { student_id, student_name, student_type, ...extras } = form;
  return { student_id, student_name, student_type, extras };
}

const getSchemaUpdates = (mode) => {
  return {
    student_id: { disabled: mode == 2 ? true : false },
  };
};

function updatedStudentSchema(mode) {
  return updateSchema(studentSchema, getSchemaUpdates(mode));
}

let _studentSchema = studentSchema;

export default function AddEditStudent({ mode, selectedStudent }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _studentSchema = updatedStudentSchema(mode);
    if (mode !== 2) return;

    getStudentApi(selectedStudent).then((resp) => {
      const { extras = {}, ...rest } = resp.data;
      const payload = { ...extras, ...rest };
      setFormData(payload);
    });
  }, []);

  function handleUpdateStudent() {
    const payload = createPayload(formData);

    updateStudentApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateStudent() {
    const payload = createPayload(formData);

    createStudentApi(payload)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_studentSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateStudent();

      case 2:
        return handleUpdateStudent();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_studentSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
