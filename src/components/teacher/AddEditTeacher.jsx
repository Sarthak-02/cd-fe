import React, { useEffect, useState } from "react";
import { teacherSchema } from "../../schemas/teacher.schema";
import { useTeacherStore } from "../../store/teacher.store";
import DynamicForm from "../../ui-components/DynamicForm";
import { MODE } from "../../utils/constants/globalConstants";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";

function createPayload(form) {
  const {
    teacher_id,
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id = "",
    teacher_employee_code,
    ...extras
  } = form;
  return {
    teacher_id,
    teacher_first_name,
    teacher_middle_name,
    teacher_last_name,
    teacher_gender,
    teacher_dob: teacher_dob ? new Date(teacher_dob).toISOString() : null,
    teacher_email,
    teacher_phone,
    teacher_status,
    campus_id,
    teacher_employee_code,
    extras,
  };
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

export default function AddEditTeacher({
  mode,
  selectedTeacher,
  campus_id,
  handleAddEditModel,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const {
    fetchTeacherDetails,
    teacherDetails,
    createTeacher,
    updateTeacher,
    loadingTeacherDetails,
  } = useTeacherStore();

  if (
    mode === MODE.EDIT &&
    teacherDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...teacherDetails, ...teacherDetails?.extras });
  }

  useEffect(() => {
    _teacherSchema = updatedTeacherSchema(mode);
    if (mode !== MODE.EDIT) return;
    fetchTeacherDetails(selectedTeacher);
  }, []);

  function handleUpdateTeacher() {
    const payload = createPayload(formData);
    updateTeacher(payload);
  }

  function handleCreateTeacher() {
    const payload = { ...createPayload(formData), campus_id };
    createTeacher(payload);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_teacherSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) {
      handleCreateTeacher();
    }
    if (mode === MODE.EDIT) {
      handleUpdateTeacher();
    }
    handleAddEditModel(MODE.NONE);
  }

  return (
    <>
      {loadingTeacherDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          <DynamicForm
            schema={_teacherSchema}
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
