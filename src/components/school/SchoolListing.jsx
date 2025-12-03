import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

export default function SchoolListing({
  handleCreate,
  schools,
  handleSelectSchool,
  loading,
}) {
  const [search, setSearch] = useState("");

  /** ----------------------------------------
   * Filter schools based on search input
   ---------------------------------------- */
  const filteredSchools = useMemo(() => {
    return schools.filter(
      ({ school_id, school_name }) =>
        school_id.toLowerCase().includes(search.toLowerCase()) ||
        school_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, schools]);

  return (
    <>
      {/* Search + Create Button */}
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5">
          <SearchBar onChange={setSearch} value={search} />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <Listing>
        {!loading
          ? filteredSchools.map((school) => (
              <Card
                key={school.school_id}
                title={school.school_name}
                subtitle={school.school_id}
                onClick={() => handleSelectSchool(school.school_id)}
              />
            ))
          : [...Array(20).fill(0)].map((_, i) => <CardSkeleton key={i} />)}
      </Listing>
    </>
  );
}
