import { create } from "zustand";
import type { UserInfo } from "@appTypes/index";

const SESSION_KEY = "_session_user";

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserInfo>) => void;
}

function readSession(): UserInfo | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  } catch {
    return null;
  }
}

const initialUser = readSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: initialUser !== null,

  login: (userInfo) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userInfo));
    } catch {
      // ignore
    }
    set({ user: userInfo, isAuthenticated: true });
  },

  logout: () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return { user: updated };
    });
  },
}));

export const useAuth = useAuthStore;
