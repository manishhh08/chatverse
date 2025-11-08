import { toast } from "react-toastify";
import {
  createUser,
  fetchAllUsers,
  fetchUserDetail,
  loginUserApi,
  verifyEmailAPi,
} from "./userApi";
import {
  setUser,
  setLoading,
  setError,
  logoutUser,
  setChatUsers,
} from "./userSlice";
import {
  storeAccessToken,
  storeRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
} from "../../utils/storageFunction";
import { socket } from "../../socketSetup/SocketContext";

// Register user
export const registerUser = (form) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await createUser(form);

    if (data?.status === "success") {
      toast.success(data?.message || "Registered successfully");
      dispatch(setLoading(false));
      return data;
    } else {
      dispatch(setError(data?.message || "Registration failed"));
      toast.error(data?.message || "Registration failed");
      return data;
    }
  } catch (err) {
    dispatch(setError(err.message || "Registration failed"));
    toast.error(err.message || "Registration failed");
  } finally {
    dispatch(setLoading(false));
  }
};

//fetch user action
export const fetchUserDetailAction = () => async (dispatch) => {
  try {
    const data = await fetchUserDetail();

    if (data?.status === "success") {
      dispatch(setUser(data.user));
    }
  } catch (error) {
    console.log(error.message);
  }
};
// Login user
export const loginUserAction = (form) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await loginUserApi(form);

    if (data?.status === "success" && data?.user) {
      storeAccessToken(data?.accessToken);
      storeRefreshToken(data?.refreshToken);

      localStorage.setItem("user", JSON.stringify(data?.user));

      dispatch(setUser(data?.user));

      toast.success("Logged in successfully");

      dispatch(fetchUserDetailAction());

      socket.auth = { token: data?.accessToken };
      socket.connect();
    } else {
      dispatch(setError(data?.message || "Login failed"));
      toast.error(data?.message || "Login failed");
    }
    return data;
  } catch (err) {
    dispatch(setError(err.message || "Login failed"));
    toast.error(err.message || "Login failed");
    return { status: "error" };
  } finally {
    dispatch(setLoading(false));
  }
};

export const getChatUsersAction = () => async (dispatch) => {
  try {
    const data = await fetchAllUsers();
    if (data?.status === "success") {
      dispatch(setChatUsers(data?.users));
    }
  } catch (err) {
    console.error(err);
  }
};

export const fetchUserAction = () => async (dispatch, getState) => {
  const token = getAccessToken(); // check token

  if (!token) return; // skip fetch entirely if no token

  try {
    dispatch(setLoading(true));

    const data = await fetchUserDetail();

    if (data?.status === "success" && data?.user) {
      dispatch(setUser(data.user));
    }
  } catch (err) {
    dispatch(setError("Failed to fetch user details"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const verifyEmailAction = async (token, email) => {
  const result = await verifyEmailAPi(token, email);
  return { status: result.status, message: result.message };
};
// Logout user
export const logoutAction = () => (dispatch) => {
  socket.removeAllListeners();
  socket.disconnect();
  localStorage.removeItem("user");
  dispatch(logoutUser());
  deleteAccessToken();
  deleteRefreshToken();
};
