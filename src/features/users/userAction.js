import { toast } from "react-toastify";
import {
  createUser,
  fetchAllUsers,
  fetchUserDetail,
  loginUserApi,
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
} from "../../utils/storageFunction";

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

// Login user
export const loginUserAction = (form) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await loginUserApi(form);

    if (data?.status === "success" && data?.data) {
      storeAccessToken(data?.accessToken);
      storeRefreshToken(data?.refreshToken);

      dispatch(setUser(data?.data));

      toast.success("Logged in successfully");
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
  const data? = await fetchUserDetail();
  if (data??.user?._id) dispatch(setUser(data?.user));
};
// Logout user
export const logoutAction = () => (dispatch) => {
  dispatch(logoutUser());
  deleteAccessToken();
  deleteRefreshToken();
};
