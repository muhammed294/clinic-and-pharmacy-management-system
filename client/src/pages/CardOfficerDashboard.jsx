import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import { Table } from 'react-bootstrap';

export default function CardOfficerDashboard() {
    const { user } = useAuth();
    const [card_number, setCardNo] = useState('');
    const [first_name, setFname] = useState('');
    const [last_name, setLname] = useState('');
    const [age, setAge] = useState('');
    const [phone_number, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/patient',
                { card_number, first_name, last_name, age, phone_number, address }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setSuccess('Patient card created successfully!');
            setCardNo('');
            setFname('');
            setLname('');
            setAge('');
            setPhoneNo('');
            setAddress('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Unable to reach the server. Please try again.');
            }
        }
    };

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/patient', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPatients();
    }, []);

    return (
        <>
        <Container className='py-5' style={{ maxWidth: '450px' }} >
            <h1 className='fw-bold text-primary'>Create Card</h1>

            {success && <Alert variant='success'>{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Card number</Form.Label>
                    <Form.Control
                        type='number'
                        value={card_number}
                        onChange={(e) => setCardNo(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type='text'
                        value={first_name}
                        onChange={(e) => setFname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type='text'
                        value={last_name}
                        onChange={(e) => setLname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type='number'
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                        type='text'
                        value={phone_number}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant='primary' type='submit' className='w-100'>Create Card</Button>
            </Form>
        </Container>
        
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Card No</th>
                    <th>First Name</th>
                    <th>First Name</th>
                    <th>Age</th>
                    <th>Phone number</th>
                    <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                    <tr key={patient.card_number}>
                        <td>{patient.card_number}</td>
                        <td>{patient.first_name}</td>
                        <td>{patient.last_name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.phone_number}</td>
                        <td>{patient.address}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
        </Container>
        
    </>
    );
}