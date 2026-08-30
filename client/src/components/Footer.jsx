import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { HeartPulse } from 'react-bootstrap-icons';
import Navbar from 'react-bootstrap/Navbar';
import { Facebook, Instagram, Telegram, EnvelopeFill, TwitterX, GeoAltFill, TelephoneFill } from 'react-bootstrap-icons'

export default function Footer() {
  return (
    <Container fluid className='bg-dark'>
        <Navbar.Brand as={Link} to="/" className='fw-bold fs-2 d-flex align-items-center gap-2 text-primary m-3'>
            <HeartPulse size = {25}/>
              Dr. Mulugeta Clinic
        </Navbar.Brand>
        <Row className="g-4 text-center">
            <Col lg={3} md={6} sm={6} className='d-flex flex-column '>
                <h5 className='text-white fw-bold'>Pages links</h5>
                <Link as={Link} to="/" className='text-white text-decoration-none'>Home</Link>
                <Link as={Link} to="/about" className='text-white text-decoration-none'>About</Link>
                <Link as={Link} to="/contact"className='text-white text-decoration-none'>Contact</Link>
            </Col>
            <Col lg={3} md={6} sm={6} className='d-flex flex-column'>
                <h5 className='text-white fw-bold'>Visit</h5>
                <a href="https://facebook.com/mulugetaclinic" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>
                    Facebook
                    <Facebook size={18} className='m-2'/>
                </a>
                <a href="https://telegram.com/mulugetaclinic" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>
                    Telegram
                    <Telegram size={18} className='m-2'/>
                </a>
                <a href="https://facebook.com/mulugetaclinic" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>
                    Instagram
                    <Instagram size={18} className='m-2'/>
                </a>
                <a href="https://facebook.com/mulugetaclinic" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>
                    X
                    <TwitterX size={18} className='m-2'/>
                </a>
            </Col>
            <Col lg={3} md={6} sm={6} className='d-flex flex-column'>
                <h5 className='text-white fw-bold'>
                    <TelephoneFill size={24} className='text-white me-2' />
                    Contact info
                    </h5>
                <p className='text-white'>+251912345678</p>
                <p className='text-white'>+251912345678</p>
                <p className='text-white'>+251912345678</p>
            </Col>
            <Col lg={3} md={6} sm={6} className='d-flex flex-column'>
                <h5 className='text-white fw-bold'>
                    <GeoAltFill size={24} className='text-white me-2' />
                    Address
                </h5>
                <a href="http://maps.appgoo.gl/link" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>Chagni behind Commericial Bank of Ethiopia</a>
                <a href="mailto:mulugetaClinic@gmail.com" target='_blank' rel='noopener nereferrer' className='text-white text-decoration-none'>
                    mulugetaClinic@gmail.com
                    <EnvelopeFill size={18} className='m-2'/>
                </a>
            </Col>
            <Col lg={12} md={12} sm={12}>
                <p className='text-white'>&copy; 2026 Dr. Mulugeta Clinic. All rights reserved.</p>
            </Col>
        </Row>
    </Container>
  )
}
