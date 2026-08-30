import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { HeartPulse } from 'react-bootstrap-icons';
import {Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user } = useAuth();
    console.log('current user:', user);
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand as={Link} to="/" className='fw-bold fs-2 d-flex align-items-center gap-2 text-primary'>
            <HeartPulse size = {25}/>
              Dr. Mulugeta
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        
        <Navbar.Collapse id="navbarScroll" className='justify-content-end'>
          <Nav
            navbarScroll
          >
            <Nav.Link as={Link} to="/" className='text-primary  fs-5'>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className='text-primary  fs-5'>About</Nav.Link>
            <Nav.Link as={Link} to="/contact" className='text-primary  fs-5'>Contact</Nav.Link>
            <Button as={Link} to="/login" variant='outline-primary' className='fw-bold fs-5 ms-4'>login</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
