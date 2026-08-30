import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { TelephoneFill, EnvelopeFill, GeoAltFill, ClockFill } from 'react-bootstrap-icons';

export default function Contact() {
  return (
    <Container className='py-5'>
        <h1 className='fw-bold text-primary mb-3'>Contact Us</h1>
        <p className='fs-5 mb-5'>Have a question or need to reach us? We're here to help.</p>

        <Row className='g-4'>
            <Col lg={5}>
                <div className='mb-4 d-flex align-items-start gap-3'>
                    <TelephoneFill size={24} className='text-primary mt-1' />
                    <div>
                        <h6 className='fw-bold mb-0'>Phone</h6>
                        <p className='mb-0'>+251 91 234 5678</p>
                    </div>
                </div>
                <div className='mb-4 d-flex align-items-start gap-3'>
                    <EnvelopeFill size={24} className='text-primary mt-1' />
                    <div>
                        <h6 className='fw-bold mb-0'>Email</h6>
                        <p className='mb-0'>mulugetaClinic@gmail.com</p>
                    </div>
                </div>
                <div className='mb-4 d-flex align-items-start gap-3'>
                    <GeoAltFill size={24} className='text-primary mt-1' />
                    <div>
                        <h6 className='fw-bold mb-0'>Address</h6>
                        <p className='mb-0'>Chagni, behind Commercial Bank of Ethiopia</p>
                    </div>
                </div>
                <div className='mb-4 d-flex align-items-start gap-3'>
                    <ClockFill size={24} className='text-primary mt-1' />
                    <div>
                        <h6 className='fw-bold mb-0'>Hours</h6>
                        <p className='mb-0'>Open 24 hours, 7 days a week</p>
                    </div>
                </div>
            </Col>

            <Col lg={7}>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter your name' />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Enter your email' />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Message</Form.Label>
                        <Form.Control as='textarea' rows={4} placeholder='How can we help you?' />
                    </Form.Group>
                    <Button variant='primary' type='submit'>Send Message</Button>
                </Form>
            </Col>
        </Row>
    </Container>
  )
}