import React, { useMemo, useState } from "react";
import Button from "../../ui-components/Button";
import Card from "../../ui-components/Card";
import Dropdown from "../../ui-components/Dropdown";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";

export default function ClassListing({
  handleCreate,
  classes,
  handleSelectClass,
  allCampus,
  selectedCampus,
  setSelectedCampus,
}) {
  const [isLoaded, setLoaded] = useState(true);
  const filteredClass = useMemo(() => {
    if (!selectedCampus) {
      return [];
    }

    return classes.filter((_class) => _class?.campus_id === selectedCampus);
  }, [selectedCampus, classes]);

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 md:w-3/5 lg:w-2/5">
          <Dropdown
            options={allCampus}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate} disabled={!selectedCampus}>
            Create
          </Button>
        </div>
      </div>

      <Listing>
        {isLoaded
          ? filteredClass.map((classItem) => {
              return (
                <Card
                  key={classItem.class_id}
                  title={classItem.class_name}
                  subtitle={classItem.class_id}
                  onClick={() => handleSelectClass(classItem.class_id)}
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
