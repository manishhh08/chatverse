import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;

      if (!state.messages[chatId]) state.messages[chatId] = [];
      state.messages[chatId].push(message);

      const chatIndex = state.chats.findIndex((c) => c._id === chatId);
      if (chatIndex > -1) {
        const chat = state.chats.splice(chatIndex, 1)[0];
        chat.lastMessage = message.text;
        chat.updatedAt = new Date();
        state.chats.unshift(chat);
      }
    },
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setChats,
  setActiveChat,
  addChat,
  setChatLoading,
  addMessage,
  setMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
