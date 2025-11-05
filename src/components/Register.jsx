import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Alert, Form } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { CustomInput } from "./custominput/CustomInput";
import { registerUser } from "../features/users/userAction";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(
      registerUser({ firstName, lastName, username, email, password })
    );
    if (data.status === "success") {
      navigate("/login");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-white mb-4">Register</h3>
      {/* {error && <Alert variant="danger">{error}</Alert>} */}
      <Form onSubmit={handleSubmit}>
        <CustomInput
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
        <CustomInput
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />
        <CustomInput
          label="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your unique username"
        />
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
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
