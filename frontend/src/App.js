import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import TripList from "./components/Trip/TripList";
import TripForm from "./components/Trip/TripForm";
import TripDetail from "./components/Trip/TripDetail";
import "./App.css";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TripList />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/new"
              element={
                <PrivateRoute>
                  <TripForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id"
              element={
                <PrivateRoute>
                  <TripDetail />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
