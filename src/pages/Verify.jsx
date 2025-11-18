import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { verifyEmailAction } from "../features/users/userAction";

const Verify = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      const result = await verifyEmailAction(token, email);
      if (result?.status === "success") {
        setVerified(true);
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
    >
      <Card
        className="shadow-lg p-4 text-center"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        {loading ? (
          <>
            <Spinner
              animation="border"
              role="status"
              variant="warning"
              className="mb-3"
            />
            <h4 className="text-secondary">Verifying your email...</h4>
            <p className="text-muted">
              Please wait a moment while we confirm your account.
            </p>
          </>
        ) : verified ? (
          <>
            <div
              className="text-success mb-3"
              style={{ fontSize: "3rem", lineHeight: "1" }}
            >
              ✓
            </div>
            <h4>Email Verified!</h4>
            <p className="text-muted">
              Your email has been successfully verified. You can now log in and
              enjoy your experience.
            </p>
            <Button
              className="text-white fw-bold px-4 mt-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <div
              className="text-danger mb-3"
              style={{ fontSize: "3rem", lineHeight: "1" }}
            >
              ✕
            </div>
            <h4>Verification Failed</h4>
            <p className="text-muted">
              We couldn’t verify your email. The link may have expired or
              already been used.
            </p>
            <Button
              variant="outline-warning"
              className="fw-bold px-4 mt-2"
              href="/resend-verification"
            >
              Resend Verification
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Verify;
