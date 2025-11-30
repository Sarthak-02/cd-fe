import React, { useEffect, useState } from "react";
import AddEditStudent from "../components/student/AddEditStudent";
import StudentListing from "../components/student/StudentListing";
import Dialog from "../ui-components/Dialog";
import { getAllStudentApi } from "../api/student.api";

export default function Student() {
  const [mode, setMode] = useState(0); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedStudent, setSelectedStudent] = useState("");
  const [allStudents, setAllStudents] = useState([]);

  function handleSelectStudent(student_id) {
    setSelectedStudent(student_id);
    setMode(2);
  }

  useEffect(() => {
    getAllStudentApi()
      .then((resp) => {
        setAllStudents(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedStudent("");
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
          <AddEditStudent selectedStudent={selectedStudent} mode={mode} />
        </Dialog>
      ) : (
        <StudentListing
          handleCreate={() => handleAddEditModel(1)}
          students={allStudents}
          handleSelectStudent={handleSelectStudent}
        />
      )}
    </>
  );
}
