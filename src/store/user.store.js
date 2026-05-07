import { create } from "zustand";
import {
  getAllUserApi,
  createUserApi,
  updateUserApi,
  getUserApi,
  deleteUserApi,
} from "../api/user.api";

export const useUsersStore = create((set, get) => ({
  // LIST
  users: [],
  loading: false,
  error: null,

  // USER DETAILS
  userDetails: null,
  loadingUserDetails: false,

  clearUserError: () => set({ error: null }),

  // ------------------------
  // FETCH USERS (LIST)
  // ------------------------
  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      const resp = await getAllUserApi();
      set({ users: resp.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // ------------------------
  // FETCH SPECIFIC USER DETAILS
  // ------------------------
  fetchUserDetails: async (userId) => {
    set({ loadingUserDetails: true, error: null });

    try {
      const resp = await getUserApi(userId);
      set({ userDetails: resp.data, loadingUserDetails: false });
    } catch (err) {
      set({ error: err, loadingUserDetails: false });
    }
  },

  // ------------------------
  // CREATE USER
  // ------------------------
  createUser: async (payload) => {
    try {
      await createUserApi(payload);
      await get().fetchUsers();
      get().clearUserDetails();
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  // ------------------------
  // UPDATE USER
  // ------------------------
  updateUser: async (payload) => {
    try {
      await updateUserApi(payload);
      get().clearUserDetails();
      await Promise.all([
        get().fetchUsers(),
        get().fetchUserDetails(payload.userid),
      ]);
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  // ------------------------
  // DELETE USER
  // ------------------------
  deleteUser: async (userid) => {
    try {
      await deleteUserApi(userid);
      await get().fetchUsers();
      get().clearUserDetails();
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },

  clearUserDetails: () => set({ userDetails: null }),
}));
