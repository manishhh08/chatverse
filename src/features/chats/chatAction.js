// chatActions.js
import { useDispatch, useSelector } from "react-redux";
import { createChatApi, getChatByIdApi } from "./chatApi";
import { addChat, setActiveChat, setChatLoading } from "./chatSlice";
import { retrieveMessages } from "../messages/messageAction";

export const useChatActions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.userStore);
  const { chats } = useSelector((store) => store.chatStore);

  // Open chat by userId (existing functionality)
  const openChat = async (selectedUserId) => {
    try {
      if (!user) throw new Error("User not logged in");
      dispatch(setChatLoading(true));

      // Check if chat exists locally
      let existingChat = chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.members.some((m) => m._id === selectedUserId) &&
          chat.members.some((m) => m._id === user._id)
      );

      if (!existingChat) {
        const result = await createChatApi([selectedUserId], false);
        if (result.status === "success" && result.chat) {
          existingChat = result.chat;
        } else if (result.status === "error" && result.chat) {
          existingChat = result.chat;
        } else {
          throw new Error("Failed to create or fetch chat");
        }

        if (!chats.some((c) => c._id === existingChat._id)) {
          dispatch(addChat(existingChat));
        }
      }

      dispatch(setActiveChat(existingChat));
      dispatch(retrieveMessages(existingChat._id));
    } catch (err) {
      console.error("Error opening chat:", err.message);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  // Open chat directly by chatId (for restoring after reload)
  const openChatById = async (chatId) => {
    try {
      dispatch(setChatLoading(true));

      // Check local store first
      let existingChat = chats.find((c) => c._id === chatId);

      // Fetch from backend if not found
      if (!existingChat) {
        const result = await getChatByIdApi(chatId);
        if (result.status === "success" && result.chat) {
          existingChat = result.chat;
          dispatch(addChat(existingChat));
        } else {
          throw new Error("Chat not found");
        }
      }

      dispatch(setActiveChat(existingChat));
      dispatch(retrieveMessages(existingChat._id));
    } catch (err) {
      console.error("Error opening chat by id:", err.message);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  return { openChat, openChatById };
};
