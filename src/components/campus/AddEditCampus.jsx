import React, { useEffect, useState } from "react";
import { campusSchema } from "../../schemas/campus.schema";
import { useCampusStore } from "../../store/campus.store";
import DynamicForm from "../../ui-components/DynamicForm";
import FormSkeleton from "../../ui-components/skeletons/FormSkeleton";
import { MODE } from "../../utils/constants/globalConstants";
import { getFieldValuesMap, updateSchema } from "../../utils/utility_functions/updateSchema";
import { validateForm } from "../../utils/validators/form_validation";
import CampusLocationMap from "../../utils/map/CampusMap";
import { getLocation } from "../../utils/map/getLocation";
import CampusLocation from "./CampusLocation";

function createPayload(form) {
  const {
    campus_id,
    campus_name,
    campus_type,
    school_id = "",
    ...extras
  } = form;
  return { campus_id, campus_name, campus_type, school_id, extras };
}

const getSchemaUpdates = (mode,latitude,longitude) => {
  return {
    campus_id: { disabled: mode == MODE.EDIT ? true : false },
    campus_latitude : mode == MODE.CREATE ? {  value:latitude }:{},
    campus_longitude : mode == MODE.CREATE ? {  value:longitude }:{},
    campus_radius:  mode == MODE.CREATE ? {value:100}:{}
  };
};

async function updatedCampusSchema(mode) {
  const {latitude,longitude,accuracy} = await getLocation()

  // const {latitude,longitude,accuracy} = {}
  // console.log(typeof(latitude),longitude)
  const updatedSchema = updateSchema(campusSchema, getSchemaUpdates(mode,latitude,longitude));
  return updatedSchema
}

let _campusSchema = campusSchema;

export default function AddEditCampus({
  mode,
  handleAddEditModel,
  selectedCampus,
  school_id,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setErrors] = useState({});
  
  const {
    campusDetails,
    loadingCampusDetails,
    fetchCampusDetails,
    createCampus,
    updateCampus,
  } = useCampusStore();

  if (
    mode === MODE.EDIT &&
    campusDetails &&
    Object.keys(formData).length === 0
  ) {
    setFormData({ ...campusDetails, ...campusDetails?.extras });
  }

  // if(mode === MODE.CREATE && Object.keys(formData).length === 0){
  //   setFormData(getFieldValuesMap(_campusSchema))
  // }
  useEffect(() => {

    async function getCampusSchema(){
      _campusSchema = await updatedCampusSchema(mode);
      if(mode === MODE.CREATE){
        setFormData(getFieldValuesMap(_campusSchema))
      }
      return _campusSchema
    }
    
    _campusSchema = getCampusSchema()
    
    
    if (mode !== MODE.EDIT)  return;

    fetchCampusDetails(selectedCampus);
  }, []);

  function handleUpdateCampus() {
    const payload = { ...createPayload(formData) };
    updateCampus(payload);
  }


  

  function handleCreateCampus() {
    const payload = { ...createPayload(formData), school_id: school_id };

    createCampus(payload);
  }

  function onSubmit() {
    const { errors, isError } = validateForm(_campusSchema, formData);

    if (isError) {
      setErrors(errors);
      return;
    }

    if (mode === MODE.CREATE) {
      handleCreateCampus();
    }

    if (mode === MODE.EDIT) {
      handleUpdateCampus();
    }

    handleAddEditModel(MODE.NONE);
  }

  console.log("form",formData)
  return (
    <div className="w-full p-4 space-y-6">
      {/* Loading */}
      {loadingCampusDetails && <FormSkeleton />}
  
      {/* Form */}
      {!loadingCampusDetails && !formData?.campus_show_map  && (
        <DynamicForm
          schema={_campusSchema}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={onSubmit}
          errors={formErrors}
        />
      )}
  
      {/* Map confirmation */}
      {!loadingCampusDetails && formData?.campus_show_map && (
        <CampusLocation formData={formData} setFormData={setFormData}/>
      )}
    </div>
  );
  
  // return (
  //   <>
  //     {loadingCampusDetails ? (
  //       <FormSkeleton />
  //     ) : (
  //       <div className="w-full p-4 space-y-6">
  //         <DynamicForm
  //           schema={_campusSchema}
  //           formData={formData}
  //           setFormData={setFormData}
  //           handleSubmit={onSubmit}
  //           errors={formErrors}
  //         />
  //       </div>
  //     )}
  //     {showMap && location && (
  //       <div className="space-y-4">
  //         <CampusLocationMap
  //           location={location}
  //           radius={radius}
  //           onLocationChange={setLocation}
  //         />

  //         <div>
  //           <label className="text-sm font-medium">Campus Radius</label>
  //           <input
  //             type="range"
  //             min={50}
  //             max={500}
  //             step={10}
  //             value={radius}
  //             onChange={(e) => setRadius(Number(e.target.value))}
  //             className="w-full"
  //           />
  //           <p className="text-sm text-gray-500">{radius} meters</p>
  //         </div>

  //         <button
  //           className="px-4 py-2 bg-blue-600 text-white rounded"
  //           onClick={handleConfirmLocation}
  //         >
  //           Confirm Location
  //         </button>
  //       </div>
  //     )}
  //   </>
  // );
}
