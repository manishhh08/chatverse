import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/PrivateLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatLayout from "./pages/ChatLayout";
import { ToastContainer } from "react-toastify";
import Verify from "./pages/Verify";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="/" element={<Login />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/chat" element={<ChatLayout />} />
          {/* <Route path="manage-account" element={<UserProfile />} /> */}
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={2000}
        closeOnClick
        newestOnTop
        draggable
      />
    </>
  );
};

export default App;
