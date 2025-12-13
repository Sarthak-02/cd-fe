import React, { useEffect, useMemo, useState } from "react";

import { schoolSchema } from "../../schemas/school.schema";
import { useSchoolsStore } from "../../store/school.store";

import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";

import { MODE } from "../../utils/constants/globalConstants";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";


const getSchemaUpdates = (mode) => ({
  school_id: { disabled: mode === MODE.EDIT },
});

function createPayload(form) {
  const { school_id, school_name, school_type, ...extras } = form;
  return { school_id, school_name, school_type, extras };
}

export default function AddEditSchool({ mode, selectedSchool, handleAddEditModel }) {
  const {
    schoolDetails,
    loadingSchoolDetails,
    fetchSchoolDetails,
    createSchool,
    updateSchool,
    
  } = useSchoolsStore();

  /** -----------------------------------
   * Local form state
   ------------------------------------ */
  const [formData, setFormData] = useState(() =>
    mode === MODE.EDIT ? schoolDetails ?? {} : {}
  );
  const [formErrors, setErrors] = useState({});

  /** -----------------------------------
   * Sync fetched details → formData (EDIT)
   ------------------------------------ */
  if (mode === MODE.EDIT && schoolDetails && Object.keys(formData).length === 0) {
    setFormData({...schoolDetails , ...schoolDetails?.extras});
  }

  /** -----------------------------------
   * Memoized schema updates
   ------------------------------------ */
  const computedSchema = useMemo(() => {
    return updateSchema(schoolSchema, getSchemaUpdates(mode));
  }, [mode]);

  /** -----------------------------------
   * Fetch details on EDIT
   ------------------------------------ */
  useEffect(() => {
    if (mode === MODE.EDIT && selectedSchool) {
      fetchSchoolDetails(selectedSchool);
    }
  }, [mode, selectedSchool, fetchSchoolDetails]);

  /** -----------------------------------
   * Submit Handler
   ------------------------------------ */
  function onSubmit() {
    const { errors, isError } = validateForm(computedSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) createSchool(createPayload(formData));
    if (mode === MODE.EDIT) updateSchool(createPayload(formData));

    handleAddEditModel(MODE.NONE);
  }

  /** -----------------------------------
   * UI
   ------------------------------------ */
  return loadingSchoolDetails ? (
    <FormSkeleton />
  ) : (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={computedSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
