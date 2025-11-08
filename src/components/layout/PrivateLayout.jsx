import { Outlet, useNavigate } from "react-router-dom";
import Auth from "../../Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserAction } from "../../features/users/userAction";

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((store) => store.userStore);

  useEffect(() => {
    dispatch(fetchUserAction());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;
    if (user === null) return;
    if (!user) navigate("/login");
  }, [user, loading, navigate]);

  return (
    <Auth>
      <main className="bg-dark text-white d-flex flex-column min-vh-100">
        <Outlet />
      </main>
    </Auth>
  );
};

export default PrivateLayout;
