import React, { useEffect, useRef, useState } from "react";
import { userSchema } from "../../schemas/user.schema";
import { useUsersStore } from "../../store/user.store";
import { useSchoolsStore } from "../../store/school.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";

const getSchemaUpdates = (mode, allSites) => ({
  userid: { disabled: mode === MODE.EDIT },
  site_permissions: {
    options: (allSites ?? []).map(({ school_id, school_name }) => ({
      value: school_id,
      label: school_name,
    })),
  },
  password: { mandatory: mode === MODE.CREATE },
});

function buildUserSchema(mode, allSites) {
  return updateSchema(userSchema, getSchemaUpdates(mode, allSites));
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditUser({
  mode,
  selectedUser,
  handleAddEditModel,
}) {
  const [schema, setSchema] = useState(() =>
    buildUserSchema(MODE.CREATE, [])
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);

  const lastBootstrapKeyRef = useRef("");
  const userFetchGenRef = useRef(0);

  const { schools } = useSchoolsStore();
  const { createUser, updateUser } = useUsersStore();

  useEffect(() => {
    const allSites = schools ?? [];
    const nextSchema = buildUserSchema(mode, allSites);
    setSchema(nextSchema);

    const bootstrapKey = `${mode}:${selectedUser}`;

    if (mode === MODE.CREATE) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useUsersStore.getState().clearUserError();
        setErrors({});
        setFormData(getFieldValuesMap(nextSchema));
      }
      setBootstrapping(false);
      return;
    }

    if (mode === MODE.EDIT) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useUsersStore.getState().clearUserError();
        setErrors({});
        setBootstrapping(true);
        setFormData({});
        const gen = ++userFetchGenRef.current;
        const userIdRequested = selectedUser;
        (async () => {
          await useUsersStore.getState().fetchUserDetails(userIdRequested);
          if (userFetchGenRef.current !== gen) return;
          const { userDetails: details, error: fetchErr } =
            useUsersStore.getState();
          if (fetchErr) {
            setDetailsLoadError(apiErrorMessage(fetchErr));
          } else if (!details || details.userid !== userIdRequested) {
            setDetailsLoadError("Could not load user.");
          } else {
            setFormData({ ...details, ...(details.extras ?? {}) });
          }
          setBootstrapping(false);
        })();
      }
    }
  }, [mode, selectedUser, schools]);

  async function onSubmit() {
    const { errors, isError } = validateForm(schema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useUsersStore.getState().clearUserError();

    try {
      if (mode === MODE.CREATE) {
        await createUser(formData);
      } else {
        await updateUser(formData);
      }
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setSubmitError(apiErrorMessage(err));
    }
  }

  const showFormSkeleton = bootstrapping && !detailsLoadError;
  const showForm = !bootstrapping && !detailsLoadError;

  return (
    <div className="w-full p-4 space-y-6">
      {submitError && (
        <div
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {detailsLoadError && (
        <div
          className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm"
          role="alert"
        >
          {detailsLoadError}
        </div>
      )}

      {showFormSkeleton && <FormSkeleton />}

      {showForm && (
        <DynamicForm
          schema={schema}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={onSubmit}
          errors={formErrors}
        />
      )}
    </div>
  );
}
