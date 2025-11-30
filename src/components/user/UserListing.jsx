import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Dropdown from "../../ui-components/Dropdown";
import Button from "../../ui-components/Button";

const _users = [
  {
    id: "sch-001",
    name: "Green Valley International School",
    type: "CBSE",
    image: "https://via.placeholder.com/150",
    details: {
      Principal: "Anita Sharma",
      Students: "1200",
      Classes: "1–12",
      Location: "Bangalore",
    },
  },
  {
    id: "sch-002",
    name: "Sunrise Public School",
    type: "ICSE",
    image: "https://via.placeholder.com/150",
    details: {
      Principal: "Rajiv Verma",
      Students: "900",
      Classes: "Nursery–10",
      Location: "Pune",
    },
  },
  {
    id: "sch-003",
    name: "St. Patrick's High School",
    type: "State Board",
    image: "https://via.placeholder.com/150",
    details: {
      Principal: "Mary D’Souza",
      Students: "700",
      Classes: "1–10",
      Location: "Mumbai",
    },
  },
  {
    id: "sch-004",
    name: "Horizon World School",
    type: "CBSE",
    image: "https://via.placeholder.com/150",
    details: {
      Principal: "Suresh Kumar",
      Students: "1500",
      Classes: "1–12",
      Location: "Delhi",
    },
  },
];

export default function UserListing({ handleCreate ,users,handleSelectUser }) {
  console.log(users)
  const [isLoaded, setLoaded] = useState(true);
  const [selected, setSelected] = useState("");
  const [search,setSearch] = useState("")

  const options = [
    { label: "School 1", value: "school1" },
    { label: "School 2", value: "school2" },
    { label: "School 3", value: "school3" },
  ];


  const filteredUsers = useMemo(()=>{
    const _users = users.filter(({userid,username}) => userid.includes(search) || username.includes(search))
    return _users
  },[search,users])

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5 ">
          <SearchBar onChange={setSearch}  value={search}/>
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <Listing>
        {isLoaded
          ? filteredUsers.map((user) => {
              return (
                <Card
                  key={user.userid}
                  title={user.username}
                  subtitle={user.userid}
                  onClick={() => handleSelectUser(user.userid)}
                  // image={school.image}
                  // details={school.details}
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
