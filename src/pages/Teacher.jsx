import React, { useEffect, useState } from "react";
import AddEditTeacher from "../components/teacher/AddEditTeacher";
import TeacherListing from "../components/teacher/TeacherListing";
import Dialog from "../ui-components/Dialog";
import { getAllTeacherApi } from "../api/teacher.api";

export default function Teacher() {
  const [mode, setMode] = useState(0); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);

  function handleSelectTeacher(teacher_id) {
    setSelectedTeacher(teacher_id);
    setMode(2);
  }

  useEffect(() => {
    getAllTeacherApi()
      .then((resp) => {
        setAllTeachers(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedTeacher("");
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(0)}
        >
          <AddEditTeacher selectedTeacher={selectedTeacher} mode={mode} />
        </Dialog>
      ) : (
        <TeacherListing
          handleCreate={() => handleAddEditModel(1)}
          teachers={allTeachers}
          handleSelectTeacher={handleSelectTeacher}
        />
      )}
    </>
  );
}
