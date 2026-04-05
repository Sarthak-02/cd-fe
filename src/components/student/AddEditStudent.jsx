import React, { useEffect, useRef, useState } from "react";
import DynamicForm from "../../ui-components/DynamicForm";
import { studentSchema } from "../../schemas/student.schema";
import { validateForm } from "../../utils/validators/form_validation";
import {
  getFieldValuesMap,
  updateSchema,
} from "../../utils/utility_functions/updateSchema";
import { MODE } from "../../utils/constants/globalConstants";

import { useStudentStore } from "../../store/student.store";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { useSectionStore } from "../../store/section.store";
import { useClassStore } from "../../store/class.store";
import { useCampusStore } from "../../store/campus.store";

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

const getSchemaUpdates = (mode, classes, sections, campusDetails) => {
  const classList = classes ?? [];
  const sectionList = sections ?? [];
  return {
    student_id: { disabled: mode === MODE.EDIT },
    student_class_id: {
      options: classList.map(({ class_name, class_id }) => ({
        label: class_name,
        value: class_id,
      })),
    },
    student_section_id: {
      options: sectionList.map(({ section_name, section_id }) => ({
        label: section_name,
        value: section_id,
      })),
    },
    student_house_name: {
      options:
        campusDetails?.extras?.house_names?.map((house) => ({
          label: house,
          value: house,
        })) ?? [],
    },
  };
};

function buildStudentSchema(mode, classes, sections, campusDetails) {
  return updateSchema(
    studentSchema,
    getSchemaUpdates(mode, classes, sections, campusDetails)
  );
}

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Something went wrong. Please try again.";
}

export default function AddEditStudent({
  mode,
  selectedStudent,
  campus_id,
  handleAddEditModel,
}) {
  const [schema, setSchema] = useState(() =>
    buildStudentSchema(MODE.CREATE, [], [], null)
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [detailsLoadError, setDetailsLoadError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);

  const lastBootstrapKeyRef = useRef("");
  const studentFetchGenRef = useRef(0);

  const { campusDetails } = useCampusStore();
  const { sections } = useSectionStore();
  const { classes } = useClassStore();
  const { createStudent, updateStudent } = useStudentStore();

  useEffect(() => {
    const classList = classes ?? [];
    const sectionList = sections ?? [];
    const nextSchema = buildStudentSchema(
      mode,
      classList,
      sectionList,
      campusDetails
    );
    setSchema(nextSchema);

    const bootstrapKey = `${mode}:${selectedStudent}:${campus_id}`;

    if (mode === MODE.CREATE) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useStudentStore.getState().clearStudentError();
        setErrors({});
        setFormData({
          ...getFieldValuesMap(nextSchema),
          ...(campus_id ? { campus_id } : {}),
        });
      }
      setBootstrapping(false);
      return;
    }

    if (mode === MODE.EDIT) {
      if (lastBootstrapKeyRef.current !== bootstrapKey) {
        lastBootstrapKeyRef.current = bootstrapKey;
        setDetailsLoadError("");
        setSubmitError("");
        useStudentStore.getState().clearStudentError();
        setErrors({});
        setBootstrapping(true);
        setFormData({});
        const gen = ++studentFetchGenRef.current;
        const studentIdRequested = selectedStudent;
        (async () => {
          await useStudentStore
            .getState()
            .fetchStudentDetails(studentIdRequested);
          if (studentFetchGenRef.current !== gen) return;
          const { studentDetails: details, error: fetchErr } =
            useStudentStore.getState();
          if (fetchErr) {
            setDetailsLoadError(apiErrorMessage(fetchErr));
          } else if (!details || details.student_id !== studentIdRequested) {
            setDetailsLoadError("Could not load student.");
          } else {
            setFormData({ ...details, ...(details.extras ?? {}) });
          }
          setBootstrapping(false);
        })();
      }
    }
  }, [mode, selectedStudent, campus_id, campusDetails, sections, classes]);

  async function onSubmit() {
    const { errors, isError } = validateForm(schema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    setSubmitError("");
    useStudentStore.getState().clearStudentError();

    const base = createPayload(formData);
    const payload =
      mode === MODE.CREATE ? { ...base, campus_id } : base;

    if (!payload.campus_id) {
      setSubmitError("Campus is required.");
      return;
    }

    try {
      if (mode === MODE.CREATE) {
        await createStudent(payload);
      } else {
        await updateStudent(payload);
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
