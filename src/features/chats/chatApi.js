import { apiProcessor } from "../../utils/axiosHelper";
const apiUrl = import.meta.env.VITE_APP_API_URL + "/api/v1";

export const fetchChatApi = () => {
  return apiProcessor({
    method: "get",
    url: `${apiUrl}/chats`,
    isPrivate: true,
  });
};

export const createChatApi = (members, isGroup = false, name) => {
  return apiProcessor({
    method: "post",
    url: `${apiUrl}/chats`,
    data: {
      members,
      isGroup,
      name,
    },
    isPrivate: true,
  });
};

export const getChatByIdApi = (chatId) => {
  return apiProcessor({
    method: "get",
    url: `${apiUrl}/chats/${chatId}`,
    isPrivate: true,
  });
};
