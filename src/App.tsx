import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ReservationList from "./components/Reservation/ReservationList";
import CreateReservation from "./components/Reservation/CreateReservation";
import ReservationDetail from "./components/Reservation/ReservationDetail";
import EditReservation from "./components/Reservation/EditReservation";
import { authService } from "./services/api";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
        path="/reservations/:id"
        element={
          <ProtectedRoute>
            <ReservationDetail />
          </ProtectedRoute>
        }
        />
        <Route 
        path="/reservations/:id/edit"
        element={
          <ProtectedRoute>
            <EditReservation />
          </ProtectedRoute>
        }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ReservationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations/create"
          element={
            <ProtectedRoute>
              <CreateReservation />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
