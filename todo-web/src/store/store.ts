import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { User } from "../interface/user";

interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
	removeUser: () => void;
	isLogin: () => boolean;
}

export const useUserStore = create<UserStore>()(
	devtools(
		persist(
			(set, get) => ({
				user: null,
				setUser: (user: User) =>
					set({
						user: user,
					}),
				removeUser: () => set({ user: null }),
				isLogin: () => {
					return !!get().user?.id;
				},
			}),
			{
				name: "todo-storage",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);
