import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FabricTextComponent from './canvascomponent/fabricComponent'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Settings } from './pages/Settings'
import { ErrorPage } from './pages/ErrorPage'
import { Credits } from './pages/Credits'
import { Branding } from './pages/Branding'
import { StoreConnect } from './pages/StoreConnect'
import { Orders } from './pages/Orders'
import { Resources } from './pages/Resources'
//import CanvasComponent from './canvascomponent/demo'
// import TShirtEditor from './canvascomponent/CanvasComponent'
// import TShirtDesigner from './canvascomponent/navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1A1A1A]">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customizer" element={<FabricTextComponent />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/store-connect" element={<StoreConnect />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
