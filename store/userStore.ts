import { IUser } from "@/types/user.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  accessToken: string;
  user: IUser | null;
};

type Actions = {
  setUserSession: (data: { user: IUser; accessToken: string }) => void;
  setUserData: (data: IUser) => void;
  reset: () => void;
};

const initialState: State = {
  accessToken: "",
  user: null,
};

export const useUserStore = create(
  persist<State & Actions>(
    (set) => ({
      ...initialState,
      setUserSession(data) {
        set({
          accessToken: data?.accessToken,
          user: data?.user,
        });
      },
      setUserData(data) {
        set({
          user: data,
        });
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "auth",
    }
  )
);
