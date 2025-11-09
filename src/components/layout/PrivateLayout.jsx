import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.userStore);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="bg-dark text-white d-flex flex-column min-vh-100">
      <Outlet />
    </main>
  );
};

export default PrivateLayout;
