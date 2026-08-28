import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#" className='fw-bold fs-2' style={{color: 'blue'}}>Dr. Mulugeta</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        
        <Navbar.Collapse id="navbarScroll" className='justify-content-end'>
          <Nav
            navbarScroll
          >
            <Nav.Link href="#" className='text-primary  fs-5'>Home</Nav.Link>
            <Nav.Link href="#" className='text-primary  fs-5'>About</Nav.Link>
            <Nav.Link href="#" className='text-primary  fs-5'>Contact</Nav.Link>
            <Button variant='outline-primary' className='fw-bold fs-5 ms-4'>login</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
