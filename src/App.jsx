import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import FabricTextComponent from './canvascomponent/fabricComponent'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Settings } from './pages/settings/Settings'
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
    <AppProvider i18n={enTranslations}>
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
    </AppProvider>
  )
}

export default App
