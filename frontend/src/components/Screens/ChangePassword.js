import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Changepassword.css';
import changePaasImg from '../../assets/changepass.jpeg';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setSuccess('');
      return;
    }

    setError('');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/changepassword/',
        { password, password2: confirmPassword },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess(response.data.message);
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (err) {
      setError('Error updating password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container fluid className="change-container">
      <Row className="change-row">
        <Col md={6} className="change-image-col">
          <div className="change-image">
            <img src={changePaasImg} alt="Change Password" />
          </div>
        </Col>
        <Col md={6} className="change-form-col">
          <div className="change-form shadow-sm">
            <h2 className="text-center mb-4">Change Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              <Button variant="primary" type="submit" className="change-btn">
                Change Password
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
