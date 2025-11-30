import React, { useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

export default function StudentListing({ handleCreate, students, handleSelectStudent }) {
  const [isLoaded, setLoaded] = useState(true);
  const [selected, setSelected] = useState("");

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 ">
          <SearchBar />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <Listing>
        {isLoaded
          ? students.map((student) => {
              return (
                <Card
                  key={student.student_id}
                  title={student.student_name}
                  subtitle={student.student_id}
                  onClick={() => handleSelectStudent(student.student_id)}
                />
              );
            })
          : [...Array(20).fill(0)].map(() => {
              return <CardSkeleton />;
            })}
      </Listing>
    </>
  );
}
