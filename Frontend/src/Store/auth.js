import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Check if user session exists
  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('https://crm-backend-bhuu.onrender.com/auth/me', { withCredentials: true });
      console.log("There is the response",response);
      if (response.data.loggedIn) {
        set({ user: response.data.user, isAuthenticated: true });
        console.log("User is authenticated:", response.data.user);
      } else {
        set({ user: null, isAuthenticated: false });
      }

    } catch (error) {
      console.error("Check Auth Error:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true });
    try {
      await axios.get('https://crm-backend-bhuu.onrender.com/auth/logout', { withCredentials: true });
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      set({ loading: false });
    }
  }
}));
