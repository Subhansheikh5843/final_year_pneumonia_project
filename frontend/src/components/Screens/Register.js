import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userRegisterFail, userRegisterRequest, userRegisterSuccess } from '../../store/slices/userRegister';
import { userLoginSuccess } from '../../store/slices/userSlice';
import '../css/Register.css';
import registerImg from '../../assets/Register.jpeg'; 

function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.userRegister);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
  const isPasswordValid = passwordCriteria.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setMessage('Password must include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== password2) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage('');
    dispatch(userRegisterRequest());
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register/', {
        name,
        email,
        password,
        password2,
      });
      
      dispatch(userRegisterSuccess(response.data));
      dispatch(userLoginSuccess(response.data));
      setSuccess('Registration successful!');
      
      localStorage.setItem('userInfo', JSON.stringify(response));
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      dispatch(userRegisterFail(errorMsg));
      setMessage('Registration failed. Please check your input and try again.');
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="register-row">
        <Col md={6} className="register-image-col">
          <div className="register-image">
            <img src={registerImg} alt="Register" />
          </div>
        </Col>
        <Col md={6} className="register-form-col">
          <div className="register-form shadow-sm">
            <h3 className="text-center mb-4">Register</h3>
            {message && <Alert variant="danger">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
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
                <Form.Text className="text-muted">
                
                </Form.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {!isPasswordValid && password && (
                  <Form.Text className="text-danger">
                    Should include Letters,Symbols,Numbers
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="register-btn"
                disabled={loading || !isPasswordValid}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
