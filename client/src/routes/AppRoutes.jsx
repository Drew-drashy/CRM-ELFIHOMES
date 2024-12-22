import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/Notfound'
import Leads from '../components/Leads'
const AppRoutes = () => {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/leads" element={<Leads />} />
            </Routes>
  </Router>
  )
}

export default AppRoutes
