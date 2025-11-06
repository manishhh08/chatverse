import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import chatReducer from "../features/chats/chatSlice";
import messageReducer from "../features/messages/messageSlice";

export default configureStore({
  reducer: {
    userStore: userReducer,
    chatStore: chatReducer,
    messageStore: messageReducer,
  },
});
