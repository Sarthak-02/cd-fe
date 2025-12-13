import React, { useEffect, useMemo, useState } from "react";
import { userSchema } from "../../schemas/user.schema";
import { useUsersStore } from "../../store/user.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import { updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";

const getSchemaUpdates = (mode, all_sites) => ({
  userid: { disabled: mode === MODE.EDIT },
  site_permissions: { options: all_sites .map(({school_id,school_name})=> ({value:school_id,label:school_name}))},
  password: { mandatory: mode === MODE.CREATE },
});

export default function AddEditUser({
  mode,
  selectedUser,
  handleAddEditModel,
  all_sites,
}) {
  const {
    userDetails,
    loadingUserDetails,
    fetchUserDetails,
    createUser,
    updateUser,
    
  } = useUsersStore();

  const [formData, setFormData] = useState(() =>
    mode === MODE.EDIT ? userDetails ?? {} : {}
  );

  const [formErrors, setErrors] = useState({});

  if (mode === MODE.EDIT && userDetails && Object.keys(formData).length === 0) {
    setFormData(userDetails);
  }
  //  Memoize schema (no global variable)
  const computedSchema = useMemo(() => {
    return updateSchema(userSchema, getSchemaUpdates(mode, all_sites));
  }, [mode, all_sites]);

  //  Fetch user details in EDIT mode
  useEffect(() => {
    if (mode === MODE.EDIT && selectedUser) {
      fetchUserDetails(selectedUser);
    }
  }, [mode, selectedUser, fetchUserDetails]);

  function onSubmit() {
    const { errors, isError } = validateForm(computedSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) createUser(formData);
    if (mode === MODE.EDIT) updateUser(formData);

    handleAddEditModel(MODE.NONE);
  }

  return loadingUserDetails ? (
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
