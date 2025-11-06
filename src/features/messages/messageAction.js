import { fetchMessageApi, sendMessageApi } from "./messageApi";
import { setMessages, addMessage, setLoading } from "./messageSlice";

// Load messages for a specific chat
export const retrieveMessages = (chatId) => async (dispatch) => {
  try {
    // Start loading
    dispatch(setLoading(true));

    // Fetch messages from backend
    const data = await fetchMessageApi(chatId);

    if (data.status === "success") {
      // Save messages in Redux under messagesByChat[chatId]
      dispatch(setMessages({ chatId, messages: data.messages }));
    } else {
      console.error("Failed to fetch messages:", data);
    }

    // Stop loading
    dispatch(setLoading(false));
  } catch (err) {
    console.error("Error fetching messages:", err);
    dispatch(setLoading(false));
  }
};

// Send a message for a specific chat
export const sendMessageAction = (message) => async (dispatch) => {
  try {
    // Send message to backend
    await sendMessageApi(message);
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
