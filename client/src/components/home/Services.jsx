import { Card } from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';
import { HeartPulseFill, PersonStanding, Bandaid, Clipboard2Plus, Capsule, Hospital } from 'react-bootstrap-icons';


import React from 'react'

export default function Services() {
  return (
    <>
      <Container>
        <h2 className="fw-bold mt-4 mb-3">Our Services</h2>
        <Row className="g-4 text-center">
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <HeartPulseFill size={40} className="text-primary mb-3"/>
                        <Card.Title>Children's Care</Card.Title>
                        <Card.Text>Gentle, specialized care for infants, children, and adolescents.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <PersonStanding size={40} className="text-primary mb-3"/>
                        <Card.Title>Adult Care</Card.Title>
                        <Card.Text>General checkups and treatment for adult patients of all ages.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Bandaid size={40} className="text-primary mb-3"/>
                        <Card.Title>Emergency</Card.Title>
                        <Card.Text>Fast, priority care for urgent medical situations, any time.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Clipboard2Plus size={40} className="text-primary mb-3"/>
                        <Card.Title>Laboratory</Card.Title>
                        <Card.Text>Accurate diagnostic testing, with results sent directly to your doctor.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Capsule size={40} className="text-primary mb-3"/>
                        <Card.Title>Pharmacy</Card.Title>
                        <Card.Text>Trusted medicines dispensed on-site, right after your visit.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Hospital size={40} className="text-primary mb-3"/>
                        <Card.Title>Customer service</Card.Title>
                        <Card.Text>We provide good customer services with clean environment</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
      </Container>
    </>
    
    
  )
}
