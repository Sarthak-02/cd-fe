import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logoutApi } from "../api/auth.api";  // <-- add this

const initialValue = {
  userId: "",
  username: "",
  isadmin: false,
  site_permissions: [],
  page_permissions: []
};

export const useAuth = create(
  persist(
    (set, get) => ({
      auth: initialValue,

      // Set logged-in user
      setAuth: (newUser) => set({ auth: newUser }),

      // ------------------------
      // LOGOUT USER
      // ------------------------
      logout: async () => {
        try {
          await logoutApi(); // call backend logout
        } catch (err) {
          console.error("Logout API failed (continuing):", err);
        }

        // Clear auth state
        set({ auth: initialValue });
        localStorage.removeItem("token")

        // Clear persisted storage from Zustand
        const storage = get()._storage;     // internal accessor (Zustand persist)
        if (storage?.removeItem) {
          storage.removeItem("cd-store");
        }
      }
    }),
    {
      name: "cd-store"
    }
  )
);
