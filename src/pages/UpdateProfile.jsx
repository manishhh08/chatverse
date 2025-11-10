import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Col,
  Row,
  Badge,
  Alert,
  Container,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaComments, FaSignOutAlt } from "react-icons/fa";
import { updateUserAction, logoutAction } from "../features/users/userAction";
import { CustomInput } from "../components/custominput/CustomInput";

const UpdateProfile = () => {
  const { user } = useSelector((store) => store.userStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    const result = await dispatch(updateUserAction(formData));

    if (result.status === "success") {
      setMsg(result.message);
      toast.success(result.message);
    } else {
      setError(result.message || "Something went wrong");
      toast.error(result.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful");
    navigate("/", { replace: true });
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center bg-dark py-4"
    >
      <Col xs={12} md={8} lg={6}>
        <Card className="shadow-lg rounded-4 border-0 text-center bg-secondary text-light p-4">
          {/* Initials Badge */}
          <Badge
            bg="primary"
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px", fontSize: "1.5rem" }}
          >
            {getInitials(formData.firstName, formData.lastName)}
          </Badge>

          {/* Header with Chat & Logout */}
          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <h3 className="mb-0 d-flex align-items-center">
              <FaUser className="me-2 text-primary" /> Update Profile
            </h3>

            <div className="d-flex align-items-center gap-2">
              {/* Go to Chat button */}
              <Button
                variant="primary"
                onClick={() => navigate("/chat")}
                className="d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 text-white"
              >
                <FaComments size={18} /> Go to Chat
              </Button>

              {/* Logout button */}
              <Button
                variant="danger"
                onClick={handleLogout}
                className="d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 text-white"
              >
                <FaSignOutAlt size={18} /> Logout
              </Button>
            </div>
          </div>

          {msg && <Alert variant="success">{msg}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <CustomInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="bg-dark text-light border-0"
                />
              </Col>
              <Col>
                <CustomInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="bg-dark text-light border-0"
                />
              </Col>
            </Row>

            <CustomInput
              label="Email"
              name="email"
              value={formData.email}
              readOnly
              className="bg-dark text-light border-0"
            />

            <CustomInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="bg-dark text-light border-0"
            />

            <CustomInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="bg-dark text-light border-0"
            />

            <Button
              type="submit"
              className="w-100 mt-3 py-2"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Form>
        </Card>
      </Col>
    </Container>
  );
};

export default UpdateProfile;
