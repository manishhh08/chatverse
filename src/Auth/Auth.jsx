import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = ({ children }) => {
  const location = useLocation();
  const { user, loading, isLogginOut } = useSelector(
    (store) => store.userStore
  );

  useEffect(() => {
    if (!user?._id && !isLogginOut) {
      toast.info("Please log in to continue", { toastId: "auth-toast" });
    }
  }, [user, isLogginOut]);

  if (loading) return <div>Fetching your details...</div>;

  if (!user?._id && !loading) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default Auth;
