import { apiProcessor } from "../../utils/axiosHelper";
const apiUrl = import.meta.env.VITE_APP_API_URL + "/api/v1";

//create new user
export const createUser = async (obj) => {
  return apiProcessor({
    method: "POST",
    url: `${apiUrl}/auth/register`,
    data: obj,
  });
};

// login customer
export const loginUserApi = async (obj) => {
  return apiProcessor({
    method: "POST",
    url: `${apiUrl}/auth/login`,
    data: obj,
  });
};

//get user detail
export const fetchUserDetail = async () => {
  return apiProcessor({
    method: "get",
    url: `${apiUrl}/user`,
    isPrivate: true,
  });
};

export const fetchAllUsers = async () => {
  return apiProcessor({
    method: "GET",
    url: `${apiUrl}/user/all`,
    isPrivate: true,
  });
};

// update customer detail
export const updateUserDetail = async (obj) => {
  return apiProcessor({
    method: "PATCH",
    url: `${apiUrl}/auth/user`,
    data: obj,
    isPrivate: true,
  });
};
// refresh token
export const refreshTokenApi = () => {
  return apiProcessor({
    method: "get",
    url: `${apiUrl}/auth/refresh-token`,
    isPrivate: true,
    isRefresh: true,
  });
};
