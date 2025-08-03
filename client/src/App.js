import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          !isLoggedIn ? <Navigate to="/login" /> :
            (user?.isApproved ? <Navigate to="/dashboard" /> : <WelcomePage />)
        }
      />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={['approved']}>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
    </Routes>
  );
}

export default App;


