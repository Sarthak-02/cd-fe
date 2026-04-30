import { useEffect, useState } from "react";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";
import { useCampusStore } from "../store/campus.store";
import { useClassStore } from "../store/class.store";
import { useReportDashboardStore } from "../store/report-dashboard.store";
import DashboardConfigListing from "../components/report-dashboard/DashboardConfigListing";
import AddEditDashboardConfig from "../components/report-dashboard/AddEditDashboardConfig";

export default function ReportDashboard() {
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { campuses, fetchCampuses } = useCampusStore();
  const { classes, fetchClasses } = useClassStore();
  const {
    configs,
    loading,
    error,
    fetchConfigs,
    clearError,
    clearConfigDetails,
  } = useReportDashboardStore();

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchConfigs(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampus]);

  function handleSelectConfig(config_id) {
    clearConfigDetails();
    clearError();
    setSelectedConfig(config_id);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearError();
    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedConfig("");
      clearConfigDetails();
    }
  }

  const campusClasses = classes.filter((c) => c.campus_id === selectedCampus);
  const campusConfigs = configs.filter((c) => c.campus_id === selectedCampus);

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen
          onClose={() => handleAddEditModel(MODE.NONE)}
        >
          <AddEditDashboardConfig
            mode={mode}
            selectedConfig={selectedConfig}
            campus_id={selectedCampus}
            campusClasses={campusClasses}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <DashboardConfigListing
          configs={campusConfigs}
          loading={loading}
          error={error}
          allCampus={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          handleSelectConfig={handleSelectConfig}
          onRetry={() => selectedCampus && fetchConfigs(selectedCampus)}
          onDismissError={clearError}
        />
      )}
    </>
  );
}
