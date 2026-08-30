import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import hero from '../../assets/hero.svg';
import Doctors from '../../assets/Doctors.svg';
import Emergency from '../../assets/Emergency.svg';
import Laboratory from '../../assets/Laboratory.svg';
import pharma from '../../assets/pharma.svg';

export default function WhyChooseUs() {
  return (
    <Container>
        <h2 className='fw-bold mt-4 mb-3'>Why Choose Us</h2>
        <Row className="g-4 text-center">
            <Col lg={6} md={6}>
                <img src={Doctors} alt="Doctors" className='img-fluid w-25' />
                <p>Experienced doctors across multiple departments (children, adult, emergency)</p>
            </Col>
            <Col lg={6} md={6}>
                <img src={Laboratory} alt="Laboratory" className='img-fluid w-25' />
                <p>On-site laboratory — no need to travel elsewhere for tests</p>
            </Col>
            <Col lg={6} md={6}>
                <img src={pharma} alt="Pharmacy" className='img-fluid w-25'/>
                <p>On-site pharmacy — get prescribed medicine immediately after your visit</p>
            </Col>
            <Col lg={6} md={6}>
                <img src={Emergency} alt="Emergency services" className='img-fluid w-25' />
                <p>Fast emergency response with affordable, transparent pricing</p>
            </Col>
        </Row>    
    </Container>
  )
}
