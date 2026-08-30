import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/user/login', {
                username,
                password
            });

            login(response.data);

            // Redirect based on role
            navigate(`/dashboard/${response.data.role}`);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Unable to reach the server. Please try again.');
            }
        }
    };

    return (
        <Container className='py-5' style={{ maxWidth: '450px' }}>
            <h2 className='fw-bold text-primary mb-4 text-center'>Staff Login</h2>

            {error && <Alert variant='danger'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant='primary' type='submit' className='w-100'>Log In</Button>
            </Form>
        </Container>
    );
}