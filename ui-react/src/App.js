import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import DashboardLayout from "./Components/Dashboard/dashboardLayout";
import Customer from "./Components/Customer";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
        >
          <Route path="/customer" element={<Customer />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </>

  );
}

export default App;
