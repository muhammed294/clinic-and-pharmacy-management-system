import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Award, ClipboardPulse, PeopleFill } from 'react-bootstrap-icons';

export default function About() {
  return (
    <Container className='py-5'>
        <Row className='align-items-center mb-5'>
            <Col lg={12}>
                <h1 className='fw-bold text-primary'>About Us</h1>
                <p className='mt-3 fs-5'>
                    Dr. Mulugeta Clinic has been serving the Chagni community with
                    reliable, affordable healthcare for families of all ages. From
                    routine checkups to emergency care, our team is committed to
                    treating every patient with respect, speed, and genuine care.
                </p>
            </Col>
        </Row>

        <Row className='g-4 text-center mb-5'>
            <Col md={4}>
                <Award size={40} className='text-primary mb-3' />
                <h5 className='fw-bold'>Our Mission</h5>
                <p>To provide accessible, high-quality healthcare to every member of our community, regardless of background.</p>
            </Col>
            <Col md={4}>
                <ClipboardPulse size={40} className='text-primary mb-3' />
                <h5 className='fw-bold'>Our Approach</h5>
                <p>Combining experienced medical staff with on-site lab and pharmacy services, all under one roof.</p>
            </Col>
            <Col md={4}>
                <PeopleFill size={40} className='text-primary mb-3' />
                <h5 className='fw-bold'>Our Team</h5>
                <p>A dedicated team of doctors, nurses, lab technicians, and pharmacists working together for your health.</p>
            </Col>
        </Row>

        <Row className='bg-primary-subtle rounded p-4'>
            <Col>
                <h3 className='fw-bold'>Our Departments</h3>
                <p className='mb-0'>
                    We proudly serve patients through our Children's Care, Adult Care,
                    Emergency, Laboratory, and Pharmacy departments — each staffed by
                    professionals dedicated to your specific needs.
                </p>
            </Col>
        </Row>
    </Container>
  )
}
