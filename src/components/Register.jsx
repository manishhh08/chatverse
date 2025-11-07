import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
} from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../features/users/userAction";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    const data = await dispatch(
      registerUser({ firstName, lastName, username, email, password })
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
              {/* Name Fields */}
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaUser className="text-white me-2" />
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaUser className="text-white me-2" />
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaUser className="text-white me-2" />
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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

              {/* Confirm Password */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="d-flex align-items-center bg-dark rounded-3 px-2">
                  <FaLock className="text-white me-2" />
                  <Form.Control
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-dark text-white border-0"
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="text-white ms-2 p-0"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>

              <Button type="submit" disabled={loading} className="w-100 mt-2">
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
