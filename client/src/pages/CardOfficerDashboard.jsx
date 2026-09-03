import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CardOfficerDashboard() {
    const { user } = useAuth();

    //CREATE FORM STATE
    const [card_number, setCardNo] = useState('');
    const [first_name, setFname] = useState('');
    const [last_name, setLname] = useState('');
    const [age, setAge] = useState('');
    const [phone_number, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    //PATIENT LIST STATE
    const [patients, setPatients] = useState([]);
    const [showTable, setShowTable] = useState(false);

    //EDIT FORM STATE
    const [editingPatient, setEditingPatient] = useState(null);
    const [edit_card_number, setEditCardNo] = useState('');
    const [edit_first_name, setEditFname] = useState('');
    const [edit_last_name, setEditLname] = useState('');
    const [edit_age, setEditAge] = useState('');
    const [edit_phone_number, setEditPhoneNo] = useState('');
    const [edit_address, setEditAddress] = useState('');
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    //DELETE CONFIRM STATE
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    //VISIT STATE
    const [doctors, setDoctors] = useState([]);
    const [startingVisitPatient, setStartingVisitPatient] = useState(null);
    const [visit_department, setVisitDepartment] = useState('');
    const [visit_doctor_id, setVisitDoctorId] = useState('');
    const [visit_type, setVisitType] = useState('');
    const [visitError, setVisitError] = useState('');

    //VITALS STATE (new)
    const [visitForVitals, setVisitForVitals] = useState(null);
    const [weight, setWeight] = useState('');
    const [body_temperature, setBodyTemperature] = useState('');
    const [vitalsError, setVitalsError] = useState('');
    const [vitalsSuccess, setVitalsSuccess] = useState('');

    //PAYMENT STATE
    const [unpaidLabRequests, setUnpaidLabRequests] = useState([]);
    const [payingLabRequest, setPayingLabRequest] = useState(null);
    const [payment_amount, setPaymentAmount] = useState('');
    const [payment_method, setPaymentMethod] = useState('');
    const [transaction_reference, setTransactionReference] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState('');

    //REGISTRATION PAYMENT STATE
    const [regPaymentVisitId, setRegPaymentVisitId] = useState('');
    const [regPaymentAmount, setRegPaymentAmount] = useState('');
    const [regPaymentMethod, setRegPaymentMethod] = useState('');
    const [regTransactionReference, setRegTransactionReference] = useState('');
    const [regPaymentError, setRegPaymentError] = useState('');
    const [regPaymentSuccess, setRegPaymentSuccess] = useState('');

    //CREATE PATIENT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/patient',
                { card_number, first_name, last_name, age, phone_number, address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Patient card created successfully!');
            setCardNo('');
            setFname('');
            setLname('');
            setAge('');
            setPhoneNo('');
            setAddress('');
            fetchPatients();
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Unable to reach the server. Please try again.');
            }
        }
    };

    //FETCH ALL PATIENTS
    const fetchPatients = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/patient', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    function callBothfunctions() {
        fetchPatients();
        setShowTable(true);
    }

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (patients.length > 0) {
            const maxCardNo = Math.max(...patients.map(p => Number(p.card_number)));
            setCardNo(String(maxCardNo + 1));
        }
    }, [patients]);

    //FETCH lab requests still needing payment
    const fetchUnpaidLabRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/labrequest', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const unpaid = response.data.filter((lr) => lr.status === 'requested');
            setUnpaidLabRequests(unpaid);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUnpaidLabRequests();
    }, []);

    //OPEN lab payment form
    const handleOpenLabPayment = (labRequest) => {
        setPayingLabRequest(labRequest);
        setPaymentAmount('');
        setPaymentMethod('');
        setTransactionReference('');
        setPaymentError('');
        setPaymentSuccess('');
    };

    //SUBMIT lab payment
    const handleLabPaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/payment',
                {
                    visit_id: payingLabRequest.visit_id,
                    lab_request_id: payingLabRequest.id,
                    payment_type: 'lab',
                    amount: payment_amount,
                    payment_method,
                    transaction_reference,
                    collected_by: user.id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaymentSuccess('Lab payment recorded and approved!');
            setPayingLabRequest(null);
            fetchUnpaidLabRequests();
        } catch (err) {
            if (err.response) {
                setPaymentError(err.response.data.message);
            } else {
                setPaymentError('Unable to reach the server.');
            }
        }
    };

    //SUBMIT registration payment (standalone, by visit id)
    const handleRegPaymentSubmit = async (e) => {
        e.preventDefault();
        setRegPaymentError('');
        setRegPaymentSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/payment',
                {
                    visit_id: regPaymentVisitId,
                    payment_type: 'registration',
                    amount: regPaymentAmount,
                    payment_method: regPaymentMethod,
                    transaction_reference: regTransactionReference,
                    collected_by: user.id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRegPaymentSuccess('Registration payment recorded successfully!');
            setRegPaymentVisitId('');
            setRegPaymentAmount('');
            setRegPaymentMethod('');
            setRegTransactionReference('');
        } catch (err) {
            if (err.response) {
                setRegPaymentError(err.response.data.message);
            } else {
                setRegPaymentError('Unable to reach the server.');
            }
        }
    };

    //EDIT fetch single patient by id
    const handleEditClick = async (patientId) => {
        setEditError('');
        setEditSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const patient = response.data;
            setEditingPatient(patient);
            setEditCardNo(patient.card_number);
            setEditFname(patient.first_name);
            setEditLname(patient.last_name);
            setEditAge(patient.age);
            setEditPhoneNo(patient.phone_number);
            setEditAddress(patient.address);
        } catch (err) {
            if (err.response) {
                setEditError(err.response.data.message);
            } else {
                setEditError('Unable to reach the server.');
            }
        }
    };

    //EDIT submit update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setEditError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/patient/${editingPatient.id}`,
                {
                    card_number: edit_card_number,
                    first_name: edit_first_name,
                    last_name: edit_last_name,
                    age: edit_age,
                    phone_number: edit_phone_number,
                    address: edit_address
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditSuccess('Patient updated successfully!');
            fetchPatients();
            setEditingPatient(null);
        } catch (err) {
            if (err.response) {
                setEditError(err.response.data.message);
            } else {
                setEditError('Unable to reach the server. Please try again.');
            }
        }
    };

    //DELETE confirm then delete
    const handleDeleteConfirm = async () => {
        setDeleteError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/patient/${patientToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteConfirm(false);
            setPatientToDelete(null);
            fetchPatients();
        } catch (err) {
            if (err.response) {
                setDeleteError(err.response.data.message);
            } else {
                setDeleteError('Unable to reach the server. Please try again.');
            }
        }
    };

    //fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/doctor', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctors();
    }, []);

    //handle start visit
    const handleStartVisitClick = (patient) => {
        setStartingVisitPatient(patient);
        setVisitDepartment('');
        setVisitDoctorId('');
        setVisitType('');
        setVisitError('');
    };

    //CHANGED: now actually completes the flow instead of just logging/commenting out next steps
    const handleStartVisitSubmit = async (e) => {
        e.preventDefault();
        setVisitError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/visit',
                {
                    patient_id: startingVisitPatient.id,
                    doctor_id: visit_doctor_id,
                    department: visit_department,
                    visit_type: visit_type,
                    created_by: user.id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newVisitId = response.data.id;
            setStartingVisitPatient(null);
            setVisitForVitals(newVisitId);
            setWeight('');
            setBodyTemperature('');
            setVitalsError('');
            setVitalsSuccess('');
        } catch (err) {
            if (err.response) {
                setVisitError(err.response.data.message);
            } else {
                setVisitError('Unable to reach the server.');
            }
        }
    };

    //NEW: submit vitals for the visit just created
    const handleVitalsSubmit = async (e) => {
        e.preventDefault();
        setVitalsError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/vitals',
                {
                    visit_id: visitForVitals,
                    weight,
                    body_temperature
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVitalsSuccess('Vitals recorded successfully!');
            setVisitForVitals(null);
            setWeight('');
            setBodyTemperature('');
        } catch (err) {
            if (err.response) {
                setVitalsError(err.response.data.message);
            } else {
                setVitalsError('Unable to reach the server.');
            }
        }
    };

    return (
        <>
            {/*CREATE CARD FORM*/}
            <Container className='py-5' style={{ maxWidth: '450px' }}>
                <h1 className='fw-bold text-primary'>Create Card</h1>
                {success && <Alert variant='success'>{success}</Alert>}
                {error && <Alert variant='danger'>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Card number</Form.Label>
                        <Form.Control type='number' value={card_number} onChange={(e) => setCardNo(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>First name</Form.Label>
                        <Form.Control type='text' value={first_name} onChange={(e) => setFname(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type='text' value={last_name} onChange={(e) => setLname(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Age</Form.Label>
                        <Form.Control type='number' value={age} onChange={(e) => setAge(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control type='text' value={phone_number} onChange={(e) => setPhoneNo(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </Form.Group>
                    <Button variant='primary' type='submit' className='w-100'>Create Card</Button>
                </Form>
            </Container>

            {/*PATIENT TABLE*/}
            <Container>
                <Button onClick={callBothfunctions} variant='primary' style={{ maxWidth: '450px' }}>See Patient</Button>
                {showTable && (
                    <div>
                        <Button onClick={() => setShowTable(false)} variant='primary' className='m-1'>Close</Button>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Card No</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Age</th>
                                    <th>Phone number</th>
                                    <th>Address</th>
                                    <th></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...patients].reverse().map((patient) => (
                                    <tr key={patient.id}>
                                        <td>{patient.card_number}</td>
                                        <td>{patient.first_name}</td>
                                        <td>{patient.last_name}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.phone_number}</td>
                                        <td>{patient.address}</td>
                                        <td>
                                            <Button size='sm' variant='warning' onClick={() => handleEditClick(patient.id)}>Edit</Button>
                                        </td>
                                        <td><Button size='sm' variant='danger' onClick={() => {
                                                setPatientToDelete(patient);
                                                setShowDeleteConfirm(true);
                                                setDeleteError('');
                                            }}>Delete</Button></td>
                                        <td><Button size='sm' variant='success' onClick={() => handleStartVisitClick(patient)}>+Visit</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={() => setShowTable(false)} variant='primary' className='m-1'>Close</Button>
                    </div>
                )}

                {/*EDIT SPACE*/}
                {editingPatient && (
                    <div className='mt-3 p-3 border rounded'>
                        <h4>Edit Patient - {editingPatient.first_name} {editingPatient.last_name}</h4>
                        {editSuccess && <Alert variant='success'>{editSuccess}</Alert>}
                        {editError && <Alert variant='danger'>{editError}</Alert>}

                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Card number</Form.Label>
                                <Form.Control type='number' value={edit_card_number} onChange={(e) => setEditCardNo(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>First name</Form.Label>
                                <Form.Control type='text' value={edit_first_name} onChange={(e) => setEditFname(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type='text' value={edit_last_name} onChange={(e) => setEditLname(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Age</Form.Label>
                                <Form.Control type='number' value={edit_age} onChange={(e) => setEditAge(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control type='text' value={edit_phone_number} onChange={(e) => setEditPhoneNo(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type='text' value={edit_address} onChange={(e) => setEditAddress(e.target.value)} required />
                            </Form.Group>
                            <Button variant='primary' type='submit' className='me-2'>Save Changes</Button>
                            <Button variant='secondary' onClick={() => setEditingPatient(null)}>Cancel</Button>
                        </Form>
                    </div>
                )}

                {/*VITALS*/}
                {visitForVitals && (
                    <div className='mt-3 p-3 border rounded bg-light'>
                        <h4>Record Vitals - Visit #{visitForVitals}</h4>
                        {vitalsError && <Alert variant='danger'>{vitalsError}</Alert>}

                        <Form onSubmit={handleVitalsSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Weight (kg)</Form.Label>
                                <Form.Control type='number' step='0.1' value={weight} onChange={(e) => setWeight(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Body Temperature (°C)</Form.Label>
                                <Form.Control type='number' step='0.1' value={body_temperature} onChange={(e) => setBodyTemperature(e.target.value)} required />
                            </Form.Group>
                            <Button variant='primary' type='submit' className='me-2'>Save Vitals</Button>
                            <Button variant='secondary' onClick={() => setVisitForVitals(null)}>Skip for now</Button>
                        </Form>
                    </div>
                )}

                {vitalsSuccess && <Alert variant='success' className='mt-3'>{vitalsSuccess}</Alert>}
            </Container>

            {/*DELETE CONFIRM MODAL*/}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant='danger'>{deleteError}</Alert>}
                    Are you sure you want to delete patient{' '}
                    <strong>{patientToDelete?.first_name} {patientToDelete?.last_name}</strong>
                    (Card No {' '}{patientToDelete?.card_number})?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant='danger' onClick={handleDeleteConfirm}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/*PAYMENT SECTION*/}
            <Container className='py-4'>
                <h4 className='fw-bold text-primary'>Lab Payments Pending</h4>
                {paymentSuccess && <Alert variant='success'>{paymentSuccess}</Alert>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Lab Request ID</th>
                            <th>Visit ID</th>
                            <th>Test Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unpaidLabRequests.map((lr) => (
                            <tr key={lr.id}>
                                <td>{lr.id}</td>
                                <td>{lr.visit_id}</td>
                                <td>{lr.test_name}</td>
                                <td>
                                    <Button size='sm' variant='success' onClick={() => handleOpenLabPayment(lr)}>Process Payment</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {unpaidLabRequests.length === 0 && <p className='text-muted'>No pending lab payments.</p>}

                {payingLabRequest && (
                    <div className='mt-3 p-3 border rounded bg-light'>
                        <h5>Pay for: {payingLabRequest.test_name} (Visit #{payingLabRequest.visit_id})</h5>
                        {paymentError && <Alert variant='danger'>{paymentError}</Alert>}
                        <Form onSubmit={handleLabPaymentSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type='number' value={payment_amount} onChange={(e) => setPaymentAmount(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Select value={payment_method} onChange={(e) => setPaymentMethod(e.target.value)} required>
                                    <option value=''>Select method</option>
                                    <option value='cash'>Cash</option>
                                    <option value='telebirr'>Telebirr</option>
                                    <option value='cbe_birr'>CBE Birr</option>
                                    <option value='boa'>BOA</option>
                                </Form.Select>
                            </Form.Group>
                            {payment_method && payment_method !== 'cash' && (
                                <Form.Group className='mb-3'>
                                    <Form.Label>Transaction Reference</Form.Label>
                                    <Form.Control type='text' value={transaction_reference} onChange={(e) => setTransactionReference(e.target.value)} required />
                                </Form.Group>
                            )}
                            <Button variant='primary' type='submit' className='me-2'>Confirm Payment</Button>
                            <Button variant='secondary' onClick={() => setPayingLabRequest(null)}>Cancel</Button>
                        </Form>
                    </div>
                )}

                <hr className='my-4' />

                <h4 className='fw-bold text-primary'>Registration Payment</h4>
                {regPaymentSuccess && <Alert variant='success'>{regPaymentSuccess}</Alert>}
                {regPaymentError && <Alert variant='danger'>{regPaymentError}</Alert>}
                <Form onSubmit={handleRegPaymentSubmit} style={{ maxWidth: '450px' }}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Visit ID</Form.Label>
                        <Form.Control type='number' value={regPaymentVisitId} onChange={(e) => setRegPaymentVisitId(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type='number' value={regPaymentAmount} onChange={(e) => setRegPaymentAmount(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select value={regPaymentMethod} onChange={(e) => setRegPaymentMethod(e.target.value)} required>
                        <option value=''>Select method</option>
                            <option value='cash'>Cash</option>
                            <option value='telebirr'>Telebirr</option>
                            <option value='cbe_birr'>CBE Birr</option>
                            <option value='boa'>BOA</option>
                        </Form.Select>
                    </Form.Group>
                    {regPaymentMethod && regPaymentMethod !== 'cash' && (
                        <Form.Group className='mb-3'>
                            <Form.Label>Transaction Reference</Form.Label>
                            <Form.Control type='text' value={regTransactionReference} onChange={(e) => setRegTransactionReference(e.target.value)} required />
                        </Form.Group>
                    )}
                    <Button variant='primary' type='submit' className='w-100'>Confirm Payment</Button>
                </Form>
            </Container>

            {/* Start visit */}
            {startingVisitPatient && (
                <div className='mt-3 p-3 border rounded container'>
                    <h4>Start Visit - {startingVisitPatient.first_name} {startingVisitPatient.last_name}</h4>
                    {visitError && <Alert variant='danger'>{visitError}</Alert>}
                    <Form onSubmit={handleStartVisitSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                                value={visit_department}
                                onChange={(e) => {
                                    setVisitDepartment(e.target.value);
                                    setVisitDoctorId('');
                                }}
                                required
                            >
                                <option value=''>Select department</option>
                                <option value='child'>Child</option>
                                <option value='adult'>Adult</option>
                                <option value='emergency'>Emergency</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Doctor</Form.Label>
                            <Form.Select
                                value={visit_doctor_id}
                                onChange={(e) => setVisitDoctorId(e.target.value)}
                                required
                                disabled={!visit_department}
                            >
                                <option value=''>Select doctor</option>
                                {doctors
                                    .filter((doc) => doc.department === visit_department)
                                    .map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            Dr. {doc.first_name} {doc.last_name}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Visit Type</Form.Label>
                            <Form.Select value={visit_type} onChange={(e) => setVisitType(e.target.value)} required>
                                <option value=''>Select visit type</option>
                                <option value='normal'>Normal</option>
                                <option value='emergency'>Emergency</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant='primary' type='submit' className='me-2'>Start Visit</Button>
                        <Button variant='secondary' onClick={() => setStartingVisitPatient(null)}>Cancel</Button>
                    </Form>
                </div>
            )}
        </>
    );
}
