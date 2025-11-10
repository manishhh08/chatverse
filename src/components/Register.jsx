import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Form,
} from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../features/users/userAction";
import { CustomInput } from "./custominput/CustomInput";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    const data = await dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
    );

    setLoading(false);

    if (data.status === "success") {
      navigate("/login");
    } else {
      setError(data.message || "Registration failed");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-dark"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={5}>
          <Card className="p-4 shadow-lg rounded-4 bg-secondary text-white">
            <h3 className="text-center mb-4">Register</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* First Name */}
              <CustomInput
                label="First Name"
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                icon={<FaUser className="text-white me-2" />}
                required
              />

              {/* Last Name */}
              <CustomInput
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                icon={<FaUser className="text-white me-2" />}
                required
              />

              {/* Username */}
              <CustomInput
                label="Username"
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                icon={<FaUser className="text-white me-2" />}
                required
              />

              {/* Email */}
              <CustomInput
                label="Email"
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={<FaEnvelope className="text-white me-2" />}
                required
              />

              {/* Phone */}
              <CustomInput
                label="Phone"
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<FaPhone className="text-white me-2" />}
                required
              />

              {/* Password */}
              <CustomInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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

              {/* Confirm Password */}
              <CustomInput
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<FaLock className="text-white me-2" />}
                append={
                  <Button
                    type="button"
                    variant="link"
                    className="text-white p-0 ms-2"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <AiFillEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </Button>
                }
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-100 mt-3 py-2"
                variant="primary"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Already have an account?{" "}
                <Link to="/login" className="text-white">
                  Login
                </Link>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
