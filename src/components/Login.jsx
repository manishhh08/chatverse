import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "./custominput/CustomInput";
import { loginUserAction } from "../features/users/userAction";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, loading } = useSelector((store) => store.userStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Await dispatch so we get `data` correctly
    const data = await dispatch(loginUserAction({ email, password }));

    // Only navigate if login was successful
    if (data?.status === "success") {
      navigate("/chat");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-white mb-4">Login</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <CustomInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <CustomInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button type="submit" disabled={loading} className="w-100 mt-3">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
