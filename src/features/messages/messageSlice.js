import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messagesByChat: {},
  loading: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messagesByChat[chatId] = messages;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messagesByChat[chatId]) state.messagesByChat[chatId] = [];
      state.messagesByChat[chatId].push(message);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setMessages, addMessage, setLoading } = messageSlice.actions;
export default messageSlice.reducer;
