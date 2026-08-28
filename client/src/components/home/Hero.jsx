import React from 'react'
import { Container, Row, Button } from 'react-bootstrap';
import hero2 from '../../assets/hero2.svg';

export default function Hero() {
  return (
    <Container fluid className='bg-primary-subtle' >
        <Container>
            <Row>
                <div className='pt-3 pb-5 col-12 col-lg-6'>
                    <h1 className='fw-bold pt-5 fs-1' style={{ maxWidth: '400px'}}>
                        WE CARE ABOUT YOUR <span className='text-primary'>HEALTH</span>
                    </h1>
                    <p className='mt-3'>
                        Dr. Mulugeta Clinic provides trusted, affordable care for the
                        whole family — from routine checkups and lab testing to
                        emergency treatment, all in one place.
                    </p>
                    <Button variant='outline-primary'>Learn more</Button>
                </div>
                <div className="col-lg-6 d-none d-lg-block" style={{textAlign: 'center'}}>
                    <img src={hero2} alt="Doctor caring paytient" className='img-fluid'/>
                </div>
            </Row>
        </Container>
    </Container>
  )
}
