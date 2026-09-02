import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Services from './components/home/Services';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import CardOfficerDashboard from './pages/CardOfficerDashboard';
import DoctorsDashboard from './pages/DoctorsDashboard';
import LaboratoryDashboard from './pages/LaboratoryDashboard';

function App() {

  return (
    <>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route
            path='/dashboard/admin'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/pharmacist'
            element={
              <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/card_officer'
            element={
              <ProtectedRoute allowedRoles={['admin', 'card_officer']}>
                <CardOfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/doctor'
            element={
              <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                <DoctorsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/lab_technician'
            element={
              <ProtectedRoute allowedRoles={['admin', 'lab_technician']}>
                <LaboratoryDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      <Footer/>
    </>
  )
}

export default App
