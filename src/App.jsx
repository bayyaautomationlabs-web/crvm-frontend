import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/OperationsDashboard';
import GoogleLeads from './pages/GoogleLeads';
import LinkedInHub from './pages/LinkedInHub';
import Pipeline from './pages/Pipeline';
import Templates from './pages/Templates';
import MakeScenarios from './pages/SourceSync';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorManagement from './pages/VendorManagement';
import SalesWorkspace, { DailyReport } from './pages/SalesWorkspace';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-400">Loading CRVM Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="crvm-app-shell card-blue-mode min-h-screen selection:bg-cyan-600 selection:text-white">
      <Sidebar />
      <div className="crvm-app-main flex min-w-0 flex-col">
        <Navbar />
        <main className="crvm-content flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<SalesWorkspace />} />
              <Route path="/reports" element={<DailyReport />} />
              <Route path="/google-leads" element={<Navigate to="/make-scenarios" replace />} />
              <Route path="/vendors" element={<VendorManagement />} />
              <Route path="/linkedin" element={<Navigate to="/leads" replace />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/templates" element={<Navigate to="/leads" replace />} />
              <Route path="/make-scenarios" element={<MakeScenarios />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
