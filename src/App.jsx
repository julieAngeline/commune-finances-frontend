import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exercices from './pages/Exercices';
import Recettes from './pages/Recettes';
import Budgets from './pages/Budgets';
import Depenses from './pages/Depenses';
import Comptes from './pages/Comptes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exercices" element={<Exercices />} />
            <Route path="/recettes" element={<Recettes />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/depenses" element={<Depenses />} />
            <Route path="/comptes" element={<Comptes />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}