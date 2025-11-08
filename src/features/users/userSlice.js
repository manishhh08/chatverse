import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  chatUsers: [],
  isLogginOut: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, actions) => {
      state.user = actions.payload;
      state.loading = false;
      state.isLogginOut = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.isLogginOut = true;
    },
    setChatUsers: (state, action) => {
      state.chatUsers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, logoutUser, setLoading, setError, setChatUsers } =
  userSlice.actions;
export default userSlice.reducer;
