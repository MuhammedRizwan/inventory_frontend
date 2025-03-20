import Iuser from "@/interface/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState= {
  user: null as Iuser | null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser( state,action: PayloadAction<Iuser>) {
        state.user= action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;