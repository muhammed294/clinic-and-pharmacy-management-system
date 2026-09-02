import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // VISIT LIST STATE
    const [visits, setVisits] = useState([]);
    const [loadError, setLoadError] = useState('');

    // SELECTED VISIT (working view)
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [vitals, setVitals] = useState(null);
    const [labResults, setLabResults] = useState([]);

    // PRESCRIPTION STATE
    const [medicine_name, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [notes, setNotes] = useState('');
    const [prescriptionError, setPrescriptionError] = useState('');
    const [prescriptionSuccess, setPrescriptionSuccess] = useState('');

    // LAB REQUEST STATE
    const [test_name, setTestName] = useState('');
    const [labRequestError, setLabRequestError] = useState('');
    const [labRequestSuccess, setLabRequestSuccess] = useState('');

    // COMPLETE VISIT STATE
    const [completeError, setCompleteError] = useState('');

    //doctor record
    const[doctorRecord, setDoctorRecord] = useState(null);

    // PATIENT HISTORY STATE
    const [historyPatientId, setHistoryPatientId] = useState('');
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyError, setHistoryError] = useState('');

    const handleSearchHistory = async (e) => {
        e.preventDefault();
        setHistoryError('');
        setPatientHistory([]);

        try {
            const visitsRes = await axios.get(`${API}/visit`, authHeader);
            const pastVisits = visitsRes.data.filter((v) => v.patient_id === Number(historyPatientId));

            const prescriptionsRes = await axios.get(`${API}/prescription`, authHeader);

            const historyWithPrescriptions = pastVisits.map((visit) => {
                const prescription = prescriptionsRes.data.find((p) => p.visit_id === visit.id);
                return { ...visit, prescription };
            });

            setPatientHistory(historyWithPrescriptions);
        } catch (err) {
            setHistoryError('Unable to load patient history.');
            }
        };

    // FETCH visits assigned to this doctor, not yet completed
    const fetchVisits = async () => {
        setLoadError('');
        try {
            const response = await axios.get(`${API}/visit`, authHeader);
            const today = new Date().toDateString();

            const myVisits = response.data.filter((v) => {
                const visitDate = new Date(v.visit_date).toDateString();
                return v.doctor_id === doctorRecord.id && v.status !== 'completed' && visitDate === today;
            });
            setVisits(myVisits);
        } catch (err) {
            setLoadError('Unable to load visits.');
        }
    };

    useEffect(() => {
        const fetchDoctorRecord = async () => {
            try {
                const response = await axios.get(`${API}/doctor`, authHeader);
                const myDoctorRecord = response.data.find((d) => d.user_id === user.id);
                setDoctorRecord(myDoctorRecord);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctorRecord();
    }, []);

    useEffect(() => {
        if (doctorRecord) {
            fetchVisits();
        }
    }, [doctorRecord]);

    // Open a visit to work on it — fetch its vitals + patient info
    const handleOpenVisit = async (visit) => {
        setSelectedVisit(visit);
        setVitals(null);
        setLabResults([]);
        setPrescriptionError('');
        setPrescriptionSuccess('');
        setLabRequestError('');
        setLabRequestSuccess('');
        setMedicineName('');
        setDosage('');
        setNotes('');
        setTestName('');

        try {
            const vitalsRes = await axios.get(`${API}/vitals`, authHeader);
            const matchingVitals = vitalsRes.data.find((v) => v.visit_id === visit.id);
            setVitals(matchingVitals || null);
        } catch (err) {
            console.error(err);
        }

        try {
            const labReqRes = await axios.get(`${API}/labrequest`, authHeader);
            const myLabRequests = labReqRes.data.filter((lr) => lr.visit_id === visit.id);

            const resultsRes = await axios.get(`${API}/labresult`, authHeader);
            const matchedResults = myLabRequests.map((lr) => {
                const result = resultsRes.data.find((r) => r.lab_request_id === lr.id);
                return { ...lr, result };
            });
            setLabResults(matchedResults);
        } catch (err) {
            console.error(err);
        }
    };

    // CREATE PRESCRIPTION
    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        setPrescriptionError('');
        setPrescriptionSuccess('');

        try {
            await axios.post(`${API}/prescription`,
                {
                    visit_id: selectedVisit.id,
                    doctor_id: doctorRecord.id,
                    medicine_name,
                    dosage,
                    notes
                },
                authHeader
            );
            setPrescriptionSuccess('Prescription saved successfully!');
        } catch (err) {
            if (err.response) {
                setPrescriptionError(err.response.data.message);
            } else {
                setPrescriptionError('Unable to reach the server.');
            }
        }
    };
    // CREATE LAB REQUEST
    const handleLabRequestSubmit = async (e) => {
        e.preventDefault();
        setLabRequestError('');
        setLabRequestSuccess('');

        try {
            await axios.post(`${API}/labrequest`,
                {
                    visit_id: selectedVisit.id,
                    doctor_id: doctorRecord.id,
                    test_name
                },
                authHeader
            );
            setLabRequestSuccess('Lab test requested successfully!');
            setTestName('');
            handleOpenVisit(selectedVisit); 
        } catch (err) {
            if (err.response) {
                setLabRequestError(err.response.data.message);
            } else {
                setLabRequestError('Unable to reach the server.');
            }
        }
    };

    // MARK VISIT COMPLETE
    const handleCompleteVisit = async () => {
        setCompleteError('');
        try {
            await axios.put(`${API}/visit/${selectedVisit.id}`,
                {
                    patient_id: selectedVisit.patient_id,
                    doctor_id: selectedVisit.doctor_id,
                    department: selectedVisit.department,
                    visit_type: selectedVisit.visit_type,
                    status: 'completed',
                    created_by: selectedVisit.created_by
                },
                authHeader
            );
            setSelectedVisit(null);
            fetchVisits();
        } catch (err) {
            if (err.response) {
                setCompleteError(err.response.data.message);
            } else {
                setCompleteError('Unable to reach the server.');
            }
        }
    };

    return (
        <Container className='py-5'>
            <h1 className='fw-bold text-primary'>Doctor Dashboard</h1>
            <p>Welcome, Dr. {user?.full_name}.</p>

            {loadError && <Alert variant='danger'>{loadError}</Alert>}

            {/* VISIT LIST */}
            {!selectedVisit && (
                <>
                    <h4 className='mt-4'>My Assigned Visits</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Visit ID</th>
                                <th>Patient ID</th>
                                <th>Department</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.map((visit) => (
                                <tr key={visit.id}>
                                    <td>{visit.id}</td>
                                    <td>{visit.patient_id}</td>
                                    <td>{visit.department}</td>
                                    <td>{visit.visit_type}</td>
                                    <td><Badge bg='info'>{visit.status}</Badge></td>
                                    <td>
                                        <Button size='sm' variant='primary' onClick={() => handleOpenVisit(visit)}>Open</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {visits.length === 0 && <p className='text-muted'>No assigned visits right now.</p>}
                </>
            )}

            <div className='mt-4 p-3 border rounded'>
            <h5 className='fw-bold'>Search Patient History</h5>
            <Form onSubmit={handleSearchHistory} className='d-flex gap-2 mb-3'>
                <Form.Control
                    type='number'
                    placeholder='Enter Patient ID'
                    value={historyPatientId}
                    onChange={(e) => setHistoryPatientId(e.target.value)}
                    style={{ maxWidth: '200px' }}
                    required
                />
                <Button type='submit' variant='primary'>Search</Button>
            </Form>

            {historyError && <Alert variant='danger'>{historyError}</Alert>}

            {patientHistory.map((visit) => (
                <div key={visit.id} className='mb-2 p-2 border-bottom'>
                    <strong>Visit #{visit.id}</strong> — {new Date(visit.visit_date).toLocaleDateString()} — {visit.department} ({visit.status})
                    {visit.prescription ? (
                        <p className='mb-0 mt-1'>
                            <em>Prescription:</em> {visit.prescription.medicine_name} — {visit.prescription.dosage}
                        </p>
                    ) : (
                        <p className='mb-0 mt-1 text-muted'>No prescription recorded.</p>
                    )}
                </div>
                ))}
            </div>

            {/* SELECTED VISIT WORKSPACE */}
            {selectedVisit && (
                
                <div className='mt-3'>
                    <Button variant='secondary' className='mb-3' onClick={() => setSelectedVisit(null)}>← Back to visit list</Button>

                    <h4>Visit #{selectedVisit.id} — Patient #{selectedVisit.patient_id}</h4>
                    {/* VITALS*/}
                    <div className='p-3 mb-3 border rounded bg-light'>
                        <h6 className='fw-bold'>Vitals</h6>
                        {vitals ? (
                            <p className='mb-0'>Weight: {vitals.weight} kg | Temperature: {vitals.body_temperature} °C</p>
                        ) : (
                            <p className='mb-0 text-muted'>No vitals recorded yet for this visit.</p>
                        )}
                    </div>

                    {/* LAB RESULTS*/}
                    <div className='p-3 mb-3 border rounded bg-light'>
                        <h6 className='fw-bold'>Lab Requests & Results</h6>
                        {labResults.length === 0 && <p className='mb-0 text-muted'>No lab tests requested for this visit.</p>}
                        {labResults.map((lr) => (
                            <div key={lr.id} className='mb-2'>
                                <strong>{lr.test_name}</strong> — <Badge bg='secondary'>{lr.status}</Badge>
                                {lr.result && <p className='mb-0 mt-1'>Result: {lr.result.result_details}</p>}
                            </div>
                        ))}
                    </div>

                    <Row>
                        {/* PRESCRIPTION FORM */}
                        <Col md={6}>
                            <div className='p-3 border rounded mb-3'>
                                <h6 className='fw-bold'>Write Prescription</h6>
                                {prescriptionSuccess && <Alert variant='success'>{prescriptionSuccess}</Alert>}
                                {prescriptionError && <Alert variant='danger'>{prescriptionError}</Alert>}
                                <Form onSubmit={handlePrescriptionSubmit}>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Medicines</Form.Label>
                                        <Form.Control as='textarea' rows={2} value={medicine_name} onChange={(e) => setMedicineName(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Dosage</Form.Label>
                                        <Form.Control as='textarea' rows={2} value={dosage} onChange={(e) => setDosage(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Notes</Form.Label>
                                        <Form.Control as='textarea' rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                                    </Form.Group>
                                    <Button variant='primary' type='submit'>Save Prescription</Button>
                                </Form>
                            </div>
                        </Col>

                        {/* LAB REQUEST FORM */}
                        <Col md={6}>
                            <div className='p-3 border rounded mb-3'>
                                <h6 className='fw-bold'>Request Lab Test</h6>
                                {labRequestSuccess && <Alert variant='success'>{labRequestSuccess}</Alert>}
                                {labRequestError && <Alert variant='danger'>{labRequestError}</Alert>}
                                <Form onSubmit={handleLabRequestSubmit}>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Test Name</Form.Label>
                                        <Form.Control type='text' value={test_name} onChange={(e) => setTestName(e.target.value)} required />
                                            </Form.Group>
                                    <Button variant='primary' type='submit'>Request Test</Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    {completeError && <Alert variant='danger'>{completeError}</Alert>}
                    <Button variant='success' onClick={handleCompleteVisit}>Mark Visit as Completed</Button>
                </div>
            )}
        </Container>
    );
}