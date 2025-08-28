import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoginFail, userLoginRequest, userLoginSuccess } from "../../store/slices/userSlice";
import "../css/Login.css";
import loginImg from "../../assets/login2.png"; 

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.userLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(userLoginRequest());
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/login/",
        { email, password }
      );
      dispatch(userLoginSuccess(response.data));
      setSuccess("Login successful!");
      localStorage.setItem("userInfo", JSON.stringify(response));
      navigate("/");
    } catch (error) {
      const errorMsg = "Invalid Credentials"
      dispatch(userLoginFail(errorMsg));
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="login-row">
        <Col md={6} className="login-image-col">
          <div className="login-image">
            <img src={loginImg} alt="Login" />
          </div>
        </Col>
        <Col md={6} className="login-form-col">
          <div className="login-form shadow-sm">
            <h3 className="text-center mb-4">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                className="login-btn mb-3"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/register")}
                className="login-btn mb-3"
                disabled={loading}
              >
                Register
              </Button>
              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant="link"
                  onClick={() => navigate("/send-reset-password-email")}
                >
                  Reset Password?
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;

