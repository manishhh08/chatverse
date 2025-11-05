import { Outlet } from "react-router-dom";
import Auth from "../../Auth/Auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserAction } from "../../features/users/userAction";

const PrivateLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserAction());
  }, [dispatch]);

  return (
    <Auth>
      <main style={{ height: "100vh" }}>
        <Outlet />
      </main>
    </Auth>
  );
};

export default PrivateLayout;
