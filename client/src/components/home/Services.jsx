import { Card } from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';

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
                        <Card.Title>Children's Care</Card.Title>
                        <Card.Text>Gentle, specialized care for infants, children, and adolescents.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>Adult Care</Card.Title>
                        <Card.Text>General checkups and treatment for adult patients of all ages.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>Emergency</Card.Title>
                        <Card.Text>Fast, priority care for urgent medical situations, any time.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>Laboratory</Card.Title>
                        <Card.Text>Accurate diagnostic testing, with results sent directly to your doctor.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>Pharmacy</Card.Title>
                        <Card.Text>Trusted medicines dispensed on-site, right after your visit.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4} md={6}>
                <Card className="h-100">
                    <Card.Body>
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
