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
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { loginUserAction } from "../features/users/userAction";
import { CustomInput } from "./custominput/CustomInput";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, loading } = useSelector((store) => store.userStore);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(loginUserAction(formData));
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
              <CustomInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<FaEnvelope className="text-white me-2" />}
                required
              />

              {/* Password */}
              <CustomInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={<FaLock className="text-white me-2" />}
                append={
                  <Button
                    type="button"
                    variant="link"
                    className="text-white p-0 ms-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </Button>
                }
                required
              />

              {/* Forgot Password */}
              <div className="text-end mb-3">
                <Link
                  to="/forgot-password"
                  className="text-white-50 small text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 mt-2 py-2"
                variant="primary"
              >
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
