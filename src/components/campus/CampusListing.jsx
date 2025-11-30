import React, { useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";

export default function CampusListing({ handleCreate, campuses, handleSelectCampus , allSchools }) {
  const [isLoaded, setLoaded] = useState(true);
  const [selected, setSelected] = useState("");

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 md:w-3/5 lg:w-2/5">
        <Dropdown
            options={allSchools}
            selected={selected}
            onChange={setSelected}
          />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <Listing>
        {isLoaded
          ? campuses.map((campus) => {
              return (
                <Card
                  key={campus.campus_id}
                  title={campus.campus_name}
                  subtitle={campus.campus_id}
                  // image={campus.image}
                  // details={campus.details}
                  onClick={() => handleSelectCampus(campus.campus_id)}
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
