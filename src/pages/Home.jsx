import React from "react";
import { useUser } from "../state";

export default function Home() {

  const user = useUser(state => state.user)

  console.log(user)
  return(
    <div>
      
    </div>
  )
  
}
