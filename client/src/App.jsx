import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Services from './components/home/Services'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import Login from './components/Login'

function App() {

  return (
    <>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      <Footer/>
    </>
  )
}

export default App
