import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AppPage from './pages/AppPage.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}