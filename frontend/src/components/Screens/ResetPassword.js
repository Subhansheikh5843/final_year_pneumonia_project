import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import resetImg from "../../assets/reset_image.png";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
  const isPasswordValid = passwordCriteria.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Must include upper, lower, number & symbol.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/reset-password/${uidb64}/${token}/`,
        { password, password2: confirmPassword }
      );
      setSuccess(response.data.message);
      setError("");
      navigate("/login");
    } catch (err) {
      setError("There was an error resetting your password.");
      setSuccess("");
    }
  };

  return (
    <Container fluid className="reset-container">
      <Row className="reset-row">
        <Col md={6} className="reset-image-col">
          <div className="reset-image">
            <img src={resetImg} alt="Reset Password" />
          </div>
        </Col>
        <Col md={6} className="reset-form-col">
          <div className="reset-form shadow-sm">
            <h2 className="text-center mb-4">Reset Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Text className="text-muted">
                  Use upper & lower case, number & symbol.
                </Form.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {!isPasswordValid && password && (
                  <Form.Text className="text-danger">
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="reset-btn"
                disabled={!isPasswordValid || password !== confirmPassword}
              >
                Reset Password
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
