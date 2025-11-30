import React, { useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

export default function SectionListing({ handleCreate, sections, handleSelectSection }) {
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
