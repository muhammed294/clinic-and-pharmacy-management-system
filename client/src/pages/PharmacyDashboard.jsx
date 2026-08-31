import React from 'react'
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function PharmacyDashboard() {
    const { user } = useAuth();

    return (
        <Container className='py-5'>
            <h1 className='fw-bold text-primary'>Pharmacy Dashboard</h1>
            <p>Welcome, {user?.full_name}. You are logged in as {user?.role}.</p>
        </Container>
    );
}