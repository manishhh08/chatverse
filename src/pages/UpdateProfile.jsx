import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction, updateUserAction } from "../features/users/userAction";
import { toast } from "react-toastify";
import { FaUser, FaComments, FaSignOutAlt } from "react-icons/fa";

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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful");
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c1c1e",
        padding: "20px",
      }}
    >
      <Col xs={12} md={8} lg={6}>
        <Card
          className="shadow-lg p-4 rounded-4 border-0 text-center"
          style={{ backgroundColor: "#2c2c2e", color: "#fff" }}
        >
          {/* Initials Badge */}
          <Badge
            bg="primary"
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px", fontSize: "1.5rem" }}
          >
            {getInitials(formData.firstName, formData.lastName)}
          </Badge>

          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <h3 className="mb-0">
              <FaUser className="me-2 text-primary" /> Update Profile
            </h3>

            {/* Wrap buttons in a flex container with small gap */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                onClick={() => navigate("/chat")}
                className="d-flex align-items-center gap-1"
              >
                <FaComments /> Go to Chat
              </Button>

              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className="d-flex align-items-center gap-1"
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>

          {msg && <Alert variant="success">{msg}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  style={{
                    backgroundColor: "#3a3a3c",
                    color: "#fff",
                    border: "none",
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  style={{
                    backgroundColor: "#3a3a3c",
                    color: "#fff",
                    border: "none",
                  }}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                readOnly
                style={{
                  cursor: "not-allowed",
                  backgroundColor: "#3a3a3c",
                  color: "#fff",
                  border: "none",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                style={{
                  backgroundColor: "#3a3a3c",
                  color: "#fff",
                  border: "none",
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 mt-2"
              disabled={loading}
              variant="primary"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Form>
        </Card>
      </Col>
    </div>
  );
};

export default UpdateProfile;
