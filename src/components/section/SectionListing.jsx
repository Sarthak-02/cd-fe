import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";
import Dropdown from "../../ui-components/Dropdown";

export default function SectionListing({
  handleCreate,
  sections,
  handleSelectSection,
  campuses,
  selectedCampus,
  setSelectedCampus,
}) {
  const [isLoaded, setLoaded] = useState(true);

  // const filteredSections = useMemo(() => {
  //   if (!selectedCampus) {
  //     return [];
  //   }

  //   return sections.filter((section) => section.campus_id === selectedCampus);
  // }, [selectedCampus, sections]);

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 md:w-3/5 lg:w-2/5">
          <Dropdown
            options={campuses}
            selected={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate} disabled={!selectedCampus}>Create</Button>
        </div>
      </div>

      <Listing>
        {isLoaded
          ? sections.map((section) => {
              return (
                <Card
                  key={section.section_id}
                  title={section.section_name}
                  subtitle={section.section_id}
                  onClick={() => handleSelectSection(section.section_id)}
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
