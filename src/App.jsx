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
import BudgetsRecettes from './pages/BudgetsRecettes';
import Parametres from './pages/Parametres';
import ChatBot from './pages/ChatBot';



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
            <Route path="/budgets-recettes" element={<BudgetsRecettes />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/assistant" element={<ChatBot />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}