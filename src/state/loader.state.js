import { create } from "zustand";

export const useLoader = create((set) =>({
    loader:false,
    startLoader : () => set(() => ({loader:true})),
    stopLoader : () => set(() => ({loader:false}))
}))