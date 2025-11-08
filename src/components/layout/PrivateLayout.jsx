import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserAction } from "../../features/users/userAction";
import { getAccessToken } from "../../utils/storageFunction";

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((store) => store.userStore);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserAction());
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (!loading && !user?._id) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <main className="bg-dark text-white d-flex flex-column min-vh-100">
      <Outlet />
    </main>
  );
};

export default PrivateLayout;
