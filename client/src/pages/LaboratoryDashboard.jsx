import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

export default function LabTechnicianDashboard() {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const [labRequests, setLabRequests] = useState([]);
    const [loadError, setLoadError] = useState('');

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [result_details, setResultDetails] = useState('');
    const [resultError, setResultError] = useState('');
    const [resultSuccess, setResultSuccess] = useState('');

    const fetchLabRequests = async () => {
        setLoadError('');
        try {
            const response = await axios.get(`${API}/labrequest`, authHeader);
            const pending = response.data.filter(
                (lr) => lr.status === 'payment_approved' || lr.status === 'in_progress'
            );
            setLabRequests(pending);
        } catch (err) {
            setLoadError('Unable to load lab requests.');
        }
    };

    useEffect(() => {
        fetchLabRequests();
    }, []);

    const handleStartTest = async (labRequest) => {
        try {
            await axios.put(`${API}/labrequest/${labRequest.id}`,
                {
                    visit_id: labRequest.visit_id,
                    doctor_id: labRequest.doctor_id,
                    test_name: labRequest.test_name,
                    status: 'in_progress',
                    approved_by: labRequest.approved_by
                },
                authHeader
            );
            fetchLabRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenResultForm = (labRequest) => {
        setSelectedRequest(labRequest);
        setResultDetails('');
        setResultError('');
        setResultSuccess('');
    };

    const handleSubmitResult = async (e) => {
        e.preventDefault();
        setResultError('');
        setResultSuccess('');

        try {
            await axios.post(`${API}/labresult`,
                {
                    lab_request_id: selectedRequest.id,
                    result_details,
                    performed_by: user.id
                },
                authHeader
            );
            setResultSuccess('Result submitted successfully!');
            setSelectedRequest(null);
            fetchLabRequests();
        } catch (err) {
            if (err.response) {
                setResultError(err.response.data.message);
            } else {
                setResultError('Unable to reach the server.');
            }
        }
    };

    return (
        <Container className='py-5'>
            <h1 className='fw-bold text-primary'>Lab Technician Dashboard</h1>
            <p>Welcome, {user?.full_name}.</p>

            {loadError && <Alert variant='danger'>{loadError}</Alert>}
            {resultSuccess && <Alert variant='success'>{resultSuccess}</Alert>}

            <h4 className='mt-4'>Pending Lab Requests</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Visit ID</th>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {labRequests.map((lr) => (
                        <tr key={lr.id}>
                            <td>{lr.id}</td>
                            <td>{lr.visit_id}</td>
                            <td>{lr.test_name}</td>
                            <td><Badge bg={lr.status === 'in_progress' ? 'warning' : 'info'}>{lr.status}</Badge></td>
                            <td>
                                {lr.status === 'payment_approved' && (
                                    <Button size='sm' variant='primary' className='me-2' onClick={() => handleStartTest(lr)}>Start Test</Button>
                                )}
                                <Button size='sm' variant='success' onClick={() => handleOpenResultForm(lr)}>Enter Result</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {labRequests.length === 0 && <p className='text-muted'>No pending lab requests.</p>}

            {selectedRequest && (
                <div className='mt-3 p-3 border rounded'>
                    <h5>Submit Result — {selectedRequest.test_name} (Visit #{selectedRequest.visit_id})</h5>
                    {resultError && <Alert variant='danger'>{resultError}</Alert>}
                    <Form onSubmit={handleSubmitResult}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Result Details</Form.Label>
                            <Form.Control as='textarea' rows={4} value={result_details} onChange={(e) => setResultDetails(e.target.value)} required />
                        </Form.Group>
                        <Button variant='primary' type='submit' className='me-2'>Submit Result</Button>
                        <Button variant='secondary' onClick={() => setSelectedRequest(null)}>Cancel</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
}