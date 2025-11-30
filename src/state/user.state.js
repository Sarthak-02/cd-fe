import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialValue = {
    userId : "",
    username:"",
    isadmin : false,
    site_permissions:[],
    page_permissions:[]
}


export const useUser = create(persist(
    (set) =>({
    user : initialValue,
    setUser : (newUser) => set(() => ({user:newUser}))
}),
{name: "cd-store"}
))

