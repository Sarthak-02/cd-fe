import React, { useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

export default function TeacherListing({ handleCreate, teachers, handleSelectTeacher }) {
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
          ? teachers.map((teacher) => {
              return (
                <Card
                  key={teacher.teacher_id}
                  title={teacher.teacher_name}
                  subtitle={teacher.teacher_id}
                  onClick={() => handleSelectTeacher(teacher.teacher_id)}
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
