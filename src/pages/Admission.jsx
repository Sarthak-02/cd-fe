import React, { useEffect, useMemo, useState } from "react";
import AddEditAdmission from "../components/admission/AddEditAdmission";
import AdmissionListing from "../components/admission/AdmissionListing";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";
import { useTranslation } from "react-i18next";

import { useCampusStore } from "../store/campus.store";
import { useAdmissionStore } from "../store/admission.store";
import { useClassStore } from "../store/class.store";

export default function Admission() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedAdmission, setSelectedAdmission] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses } = useCampusStore();

  const campusOptions = useMemo(
    () => (campuses ?? []).map((c) => ({ label: c.campus_name, value: c.campus_id })),
    [campuses]
  );

  const { fetchAdmissions, admissions, loading, error, clearAdmissionDetails, clearAdmissionError } = useAdmissionStore();
  const { fetchClasses } = useClassStore();

  function handleSelectAdmission(admission_id) {
    clearAdmissionDetails();
    clearAdmissionError();
    setSelectedAdmission(admission_id);
    setMode(MODE.EDIT);
  }

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  useEffect(() => {
    if (campuses?.length === 1) {
      setSelectedCampus(campuses[0].campus_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-select only when campuses loads
  }, [campuses]);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchAdmissions(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store actions
  }, [selectedCampus]);

  function handleAddEditModel(val) {
    setMode(val);
    clearAdmissionError();
    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedAdmission("");
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
          title={
            mode === MODE.CREATE
              ? `${t("actions.add")} ${t("entities.admission")}`
              : `${t("actions.edit")} ${t("entities.admission")}`
          }
        >
          <AddEditAdmission
            selectedAdmission={selectedAdmission}
            mode={mode}
            campus_id={selectedCampus}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <AdmissionListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          admissions={admissions}
          loading={loading}
          error={error}
          onRetry={() => selectedCampus && fetchAdmissions(selectedCampus)}
          onDismissError={clearAdmissionError}
          handleSelectAdmission={handleSelectAdmission}
          campuses={campusOptions}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
