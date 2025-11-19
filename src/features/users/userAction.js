import { toast } from "react-toastify";
import {
  createUser,
  fetchAllUsers,
  fetchUserDetail,
  loginUserApi,
  updateUserDetail,
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
  getAccessToken,
  storeUser,
  removeStoredUser,
} from "../../utils/storageFunction";
import { socket } from "../../socketSetup/SocketContext";

// Register user
export const registerUser = (form) => async (dispatch) => {
  try {
    const data = await createUser(form);

    if (data?.status === "success") {
      toast.success(data?.message || "Registered successfully");
      return data;
    } else {
      dispatch(setError(data?.message || "Registration failed"));
      toast.error(data?.message || "Registration failed");
      return data;
    }
  } catch (err) {
    dispatch(setError(err.message || "Registration failed"));
    toast.error(err.message || "Registration failed");
    return err;
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
      storeUser(data);

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

export const fetchUserAction = () => async (dispatch) => {
  const token = getAccessToken();

  if (!token) return;

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

export const updateUserAction = (userData) => async (dispatch) => {
  try {
    const { status, message, updatedUser } = await updateUserDetail(userData);

    if (status === "success") {
      dispatch(setUser(updatedUser));
      storeUser({ user: updatedUser, accessToken: getAccessToken() });
      return { status, message };
    }

    return { status: "error", message };
  } catch (error) {
    return {
      status: "error",
      message: error.response?.data?.message || error.message,
    };
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
  removeStoredUser();
  dispatch(logoutUser());
};
