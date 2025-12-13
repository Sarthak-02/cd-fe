import React, { useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";

export default function StudentListing({
  handleCreate,
  students,
  handleSelectStudent,
  campuses,
  selectedCampus,
  setSelectedCampus,
}) {
  const [isLoaded, setLoaded] = useState(true);

  return (
    <>
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-4 gap-5">
        
        {/* Campus Dropdown */}
        <div className="w-4/5 md:w-3/5 lg:w-2/5">
          <Dropdown
            options={campuses}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>

        {/* Create Button */}
        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate} disabled={!selectedCampus}>
            Create
          </Button>
        </div>
      </div>

      {/* LISTING */}
      <Listing>
        {isLoaded
          ? students.map((student) => (
              <Card
                key={student.student_id}
                title={`${student.student_first_name} ${student.student_last_name ?? ""}`}
                subtitle={student.student_admission_no}
                onClick={() => handleSelectStudent(student.student_id)}
              />
            ))
          : [...Array(20).fill(0)].map(() => <CardSkeleton />)}
      </Listing>
    </>
  );
}
