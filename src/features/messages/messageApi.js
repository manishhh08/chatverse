import { apiProcessor } from "../../utils/axiosHelper";
const apiUrl = import.meta.env.VITE_APP_API_URL + "/api/v1";

export const fetchMessageApi = async (chatId) => {
  return apiProcessor({
    method: "get",
    url: `${apiUrl}/messages/${chatId}`,
    isPrivate: true,
  });
};

//todo: add image support here
export const sendMessageApi = async (msgData) => {
  return apiProcessor({
    method: "post",
    url: `${apiUrl}/messages`,
    data: msgData,
    isPrivate: true,
  });
};
