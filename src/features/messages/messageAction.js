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
    // Send to backend
    const data = await sendMessageApi(message);

    if (data.status === "success") {
      // Use the message returned by backend
      const savedMessage = data.message;

      // Add to Redux state
      dispatch(addMessage({ chatId: message.chatId, message: savedMessage }));
    } else {
      console.error("Message failed to send", data);
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
