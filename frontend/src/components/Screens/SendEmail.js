import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/SendEmail.css';
import sendEmail from '../../assets/send_email.png';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/user/send-reset-password-email/', { email });
      setSuccess('Password reset email has been sent! Please check your inbox.');
      setError('');
      navigate('/login');
    } catch (err) {
      setError('There was an error sending the email.');
      setSuccess('');
    }
  };

  return (
    <Container fluid className="sendemail-container">
      <Row className="sendemail-row">
        <Col md={6} className="sendemail-image-col">
          <div className="sendemail-image">
            <img src={sendEmail} alt="Reset Password" />
          </div>
        </Col>
        <Col md={6} className="sendemail-form-col">
          <div className="sendemail-form shadow-sm">
            <h2 className="text-center mb-4">Reset Your Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Enter Your Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="sendemail-btn w-100">
                Send Reset Link
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SendEmail;
