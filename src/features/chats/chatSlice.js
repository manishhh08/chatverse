import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChat: null,
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setChats, setActiveChat, addChat, setChatLoading } =
  chatSlice.actions;

export default chatSlice.reducer;
