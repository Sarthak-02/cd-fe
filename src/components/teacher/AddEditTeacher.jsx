import React, { useEffect, useState } from "react";
import { teacherSchema } from "../../schemas/teacher.schema";
import { useTeacherStore } from "../../store/teacher.store";
import DynamicForm from "../../ui-components/DynamicForm";
import { MODE } from "../../utils/constants/globalConstants";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useSectionStore } from "../../store/section.store";

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
    teacher_photo_url="",
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
    teacher_photo_url,
    extras,
  };
}

const getSchemaUpdates = (mode,campusDetails,sections) => {
  return {
    teacher_id: { disabled: mode == 2 ? true : false },
    teacher_designation: { options: campusDetails?.extras?.staff_designations?.map((designation) => ({value:designation,label:designation})) },
    teacher_role: { options: campusDetails?.extras?.staff_roles?.map((role) => ({value:role,label:role})) },
    teacher_subjects : {options: campusDetails?.extras?.campus_subjects?.map((subject) => ({label:subject,value:subject}))},
    teacher_sections : {options : sections.map(({section_id="",section_name=""}) => ({label:section_name,value:section_id}))}
  };
};

function updatedTeacherSchema(mode,campusDetails,sections) {
  return updateSchema(teacherSchema, getSchemaUpdates(mode,campusDetails,sections));
}

export default function AddEditTeacher({
  mode,
  selectedTeacher,
  campus_id,
  handleAddEditModel,
  campusDetails,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [_teacherSchema, setTeacherSchema] = useState({});
  const {
    fetchTeacherDetails,
    teacherDetails,
    createTeacher,
    updateTeacher,
    loadingTeacherDetails,
  } = useTeacherStore();

  const {sections} = useSectionStore()

  if (
    mode === MODE.EDIT &&
    teacherDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...teacherDetails, ...teacherDetails?.extras });
  }


  if(Object.keys(_teacherSchema).length === 0){
    setTeacherSchema(updatedTeacherSchema(mode, campusDetails,sections));
  }
  
  useEffect(() => {
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
