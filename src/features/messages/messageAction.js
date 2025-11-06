import { fetchMessageApi, sendMessageApi } from "./messageApi";
import { setMessages, addMessage, setLoading } from "./messageSlice";

// Load messages for a specific chat
export const retrieveMessages = (chatId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await fetchMessageApi(chatId);
    if (data.status === "success") {
      dispatch(setMessages({ chatId, messages: data.messages }));
    }
    dispatch(setLoading(false));
  } catch (err) {
    console.error(err);
    dispatch(setLoading(false));
  }
};

// Send a message for a specific chat
export const sendMessageAction = (payload) => async (dispatch) => {
  try {
    const data = await sendMessageApi(payload);

    if (data.status === "success") {
      // Add the properly saved message returned by backend
      dispatch(addMessage({ chatId: payload.chatId, message: data.message }));
    } else {
      console.error("Message failed to send", data);
    }
  } catch (err) {
    console.error(err);
  }
};
