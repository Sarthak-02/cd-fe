import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { studentSchema } from "../../schemas/student.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { MODE } from "../../utils/constants/globalConstants";

import { useStudentStore } from "../../store/student.store";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useSectionStore } from "../../store/section.store";
import { useClassStore } from "../../store/class.store";

// ----------------------------
// Payload Formatter
// ----------------------------
function createPayload(form) {
  const {
    student_id,
    student_admission_no,
    student_roll_no,
    student_first_name,
    student_middle_name,
    student_last_name,
    student_gender,
    student_dob,
    student_current_status,
    campus_id,
    student_section_id,
    ...extras
  } = form;

  return {
    student_id,
    student_admission_no,
    student_roll_no,
    student_first_name,
    student_middle_name,
    student_last_name,
    student_gender,
    student_dob: student_dob ? new Date(student_dob).toISOString() : null,
    student_current_status,
    campus_id,
    student_section_id,
    extras,
  };
}

// ----------------------------
// Update schema rules
// ----------------------------
const getSchemaUpdates = (mode, classes, sections) => {
  return {
    student_id: { disabled: mode === MODE.EDIT },
    student_class_id: {
      options: classes.map(({ class_name, class_id }) => ({
        label: class_name,
        value: class_id,
      })),
    },
    student_section_id: {
      options: sections.map(({ section_name, section_id }) => ({
        label: section_name,
        value: section_id,
      })),
    },
  };
};

function updatedStudentSchema(mode, classes, sections) {
  return updateSchema(studentSchema, getSchemaUpdates(mode, classes, sections));
}

let _studentSchema = studentSchema;

// ----------------------------
// Component
// ----------------------------
export default function AddEditStudent({
  mode,
  selectedStudent,
  campus_id,
  handleAddEditModel,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  const {
    fetchStudentDetails,
    studentDetails,
    createStudent,
    updateStudent,
    loadingStudentDetails,
  } = useStudentStore();

  const { sections = [] } = useSectionStore();
  const { classes = [] } = useClassStore();

  // Load student details into form when editing
  if (
    mode === MODE.EDIT &&
    studentDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...studentDetails, ...studentDetails?.extras });
  }

  // Initialize schema + Fetch details
  useEffect(() => {
    _studentSchema = updatedStudentSchema(mode, classes, sections);

    if (mode === MODE.EDIT) {
      fetchStudentDetails(selectedStudent);
    }
  }, [sections]);

  // -----------------------
  // Submit Handlers
  // -----------------------
  function handleUpdateStudent() {
    const payload = createPayload(formData);
    updateStudent(payload, campus_id);
  }

  function handleCreateStudent() {
    const payload = { ...createPayload(formData), campus_id };
    createStudent(payload, campus_id);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_studentSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) handleCreateStudent();
    if (mode === MODE.EDIT) handleUpdateStudent();

    handleAddEditModel(MODE.NONE); // add if needed
  }

  return (
    <>
      {loadingStudentDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          <DynamicForm
            schema={_studentSchema}
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
