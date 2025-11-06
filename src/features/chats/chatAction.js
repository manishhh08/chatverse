// chatActions.js
import { useDispatch, useSelector } from "react-redux";
import { createChatApi, fetchChatApi } from "./chatApi";
import { addChat, setActiveChat, setChatLoading } from "./chatSlice";
import { retrieveMessages } from "../messages/messageAction";

export const useChatActions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.userStore);
  const { chats } = useSelector((store) => store.chatStore);

  const openChat = async (selectedUserId) => {
    try {
      if (!user) throw new Error("User not logged in");

      dispatch(setChatLoading(true));

      // Check if 1-on-1 chat already exists locally
      let existingChat = chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.members.some((m) => m._id === selectedUserId) &&
          chat.members.some((m) => m._id === user._id)
      );

      // If not found locally, call backend to create or fetch chat
      if (!existingChat) {
        const result = await createChatApi([selectedUserId], false);

        if (result.status === "success" && result.chat) {
          existingChat = result.chat;
        }
        // If backend returns "error" but includes the chat (already exists)
        else if (result.status === "error" && result.chat) {
          existingChat = result.chat;
        } else {
          throw new Error("Failed to create or fetch chat");
        }

        // Add newly fetched chat to local store if not already there
        if (!chats.some((c) => c._id === existingChat._id)) {
          dispatch(addChat(existingChat));
        }
      }

      // Set active chat
      dispatch(setActiveChat(existingChat));

      // Load messages for the active chat
      dispatch(retrieveMessages(existingChat._id));
    } catch (err) {
      console.error("Error opening chat:", err.message);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  return { openChat };
};
