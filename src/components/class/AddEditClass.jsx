import React, { useEffect, useState } from "react";
import { classSchema } from "../../schemas/class.schema";
import { useClassStore } from "../../store/class.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";

function createPayload(form) {
  const {
    class_id,
    class_name,
    class_type,
    campus_id,
    class_short_name,
    class_description,
    class_room_no,
    class_teacher_id,
    class_has_sections,
    class_stream,
    class_shift,
    ...extras
  } = form;
  return {
    class_id,
    class_name,
    class_type,
    campus_id,
    class_short_name,
    class_description,
    class_room_no,
    class_teacher_id,
    class_has_sections,
    class_stream,
    class_shift,
    extras,
  };
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

export default function AddEditClass({
  mode,
  selectedClass,
  campus_id,
  handleAddEditModel,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const {
    fetchClassDetails,
    classDetails,
    createClass,
    updateClass,
    loadingClassDetails,
  } = useClassStore();

  if (
    mode === MODE.EDIT &&
    classDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...classDetails, ...classDetails?.extras });
  }

  useEffect(() => {
    _classSchema = updatedClassSchema(mode);
    if (mode === MODE.EDIT) fetchClassDetails(selectedClass);
  }, []);

  function handleUpdateClass() {
    const payload = createPayload(formData);

    updateClass(payload, campus_id);
  }

  function handleCreateClass() {
    const payload = { ...createPayload(formData), campus_id };

    createClass(payload, campus_id);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_classSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) {
      handleCreateClass();
    }

    if (mode === MODE.EDIT) {
      handleUpdateClass();
    }

    handleAddEditModel(MODE.NONE);
  }

  return (
    <>
      {loadingClassDetails ? (
        <FormSkeleton />
      ) : (
        <div className="w-full p-4 space-y-6">
          <DynamicForm
            schema={_classSchema}
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
