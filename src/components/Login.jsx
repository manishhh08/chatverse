import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Form,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUserAction } from "../features/users/userAction";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, loading } = useSelector((store) => store.userStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(loginUserAction({ email, password }));
    if (data?.status === "success") {
      navigate("/chat");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-dark"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={5} lg={4}>
          <Card className="p-4 shadow-lg rounded-4 bg-secondary text-white">
            <h3 className="text-center mb-4">Login</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaEnvelope className="text-white me-2" />
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                </div>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-1" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaLock className="text-white me-2" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="text-white ms-2 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>

              {/* Forgot Password */}
              <div className="text-end mb-3">
                <Link
                  to="/forgot-password"
                  className="text-white-50 small text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-100 mt-2">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Don't have an account?{" "}
                <Link to="/register" className="text-white">
                  Register
                </Link>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
