import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import PetsPage from './pages/PetsPage';
import PetDetail from './pages/PetDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#3d2b1f',
              border: '1px solid rgba(61,43,31,0.12)',
              borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
            },
          }}
        />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['user', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={
              <div className="page">
                <div className="container">
                  <div className="empty-state" style={{ paddingTop: 80 }}>
                    <div className="empty-state-icon">🐾</div>
                    <h3>Page Not Found</h3>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: 20 }}>Go Home</a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <footer style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--bark-muted)', fontSize: '0.85rem', borderTop: '1px solid rgba(61,43,31,0.08)', marginTop: 40 }}>
          <p>🐾 PawsHome &mdash; Every pet deserves a loving home &copy; {new Date().getFullYear()}</p>
        </footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
