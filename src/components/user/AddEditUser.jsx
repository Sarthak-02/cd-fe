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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const lastBootstrapKeyRef = useRef("");
  const userFetchGenRef = useRef(0);

  const { schools } = useSchoolsStore();
  const { createUser, updateUser, deleteUser } = useUsersStore();

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

  async function onDelete() {
    setDeleteError("");
    try {
      await deleteUser(selectedUser);
      handleAddEditModel(MODE.NONE);
    } catch (err) {
      setDeleteError(apiErrorMessage(err));
      setConfirmDelete(false);
    }
  }

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
    <div className="w-full p-4 pb-12 space-y-6">
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
        <>
          <DynamicForm
            schema={schema}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={onSubmit}
            errors={formErrors}
          />

          {mode === MODE.EDIT && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              {deleteError && (
                <p className="text-sm text-red-600 mb-2">{deleteError}</p>
              )}
              {!confirmDelete ? (
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700 underline"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete User
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-800 flex-1 min-w-0">
                    Are you sure you want to delete this user? This cannot be undone.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md border border-gray-200 bg-white"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                      onClick={onDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
