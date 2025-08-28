import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  username: string | null;
}
const initialState: AuthState = { token: null, username: null };

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string; username: string }>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    clearToken: (state) => {
      state.token = null;
      state.username = null;
    },
  },
});

export const { setToken, clearToken } = auth.actions;
export default auth.reducer;