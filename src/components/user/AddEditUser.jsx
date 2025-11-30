import React, { useEffect, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { userSchema } from "../../schemas/user.schema";
import { validateForm } from "../../utils/validators/form_validation";
import { createUserApi, getUserApi, updateUserApi } from "../../api/user.api";
import { updateSchema } from "../../utils/utility_functions/updateSchema";

const getSchemaUpdates = (mode,all_sites) =>{
  return {
    userid : {disabled : mode == 2 ? true : false},
    site_permissions : {options : all_sites},
    password : {mandatory :  mode === 1 ? true : false}
  }
}

function updatedUserSchema(mode,all_sites){
  return updateSchema(userSchema,getSchemaUpdates(mode,all_sites))
}

let _userSchema = userSchema

export default function AddEditUser({ mode, selectedUser , all_sites }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});

  useEffect(() => {
    _userSchema = updatedUserSchema(mode,all_sites)
    if (mode !== 2) return;

    getUserApi(selectedUser).then((resp) => {
      setFormData(resp.data);
    });
  }, []);


  function handleUpdateUser() {
    updateUserApi(formData)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCreateUser() {
    createUserApi(formData)
      .then((resp) => {
        console.log(resp?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_userSchema, formData);

    if (isError) {
      console.log("form Invalid");
      setErrors(errors);
      //show an error pop up and highlight all the missed fields
      return;
    }

    switch (mode) {
      case 1:
        return handleCreateUser();

      case 2:
        return handleUpdateUser();
    }
  }

  return (
    <div className="w-full p-4 space-y-6">
      <DynamicForm
        schema={_userSchema}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={onSubmit}
        errors={formErrors}
      />
    </div>
  );
}
