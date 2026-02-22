"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  phone: string;
  email: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  role: "customer" | "craftsman";
  craftsmanId?: string;
  profile: UserProfile;
}

export interface DemoCraftsman {
  id: string;
  name: string;
  craftsmanId: string;
  description: string;
}

export const DEMO_CRAFTSMEN: DemoCraftsman[] = [
  {
    id: "demo_craftsman_taro",
    name: "職人太郎",
    craftsmanId: "1",
    description: "山田エアコンサービス（エアコン専門）",
  },
];

export interface DemoCustomer {
  id: string;
  name: string;
  description: string;
}

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: "demo_customer_taro",
    name: "依頼者太郎",
    description: "デモ用のお客様アカウント",
  },
];

interface AuthState {
  user: User | null;
  login: (name: string, role: "customer" | "craftsman", craftsmanId?: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateName: (name: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (name, role, craftsmanId) => {
        const user: User = {
          id: craftsmanId || `user_${Date.now()}`,
          name,
          role,
          craftsmanId: role === "craftsman" ? craftsmanId : undefined,
          profile: {
            phone: "",
            email: "",
            address: "",
          },
        };
        set({ user });
      },
      logout: () => set({ user: null }),
      isLoggedIn: () => get().user !== null,
      updateProfile: (profile) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              profile: {
                ...currentUser.profile,
                ...profile,
              },
            },
          });
        }
      },
      updateName: (name) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              name,
            },
          });
        }
      },
    }),
    {
      name: "shokunin-auth",
    }
  )
);
