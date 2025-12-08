// src/App.tsx
import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";

import UserLogin from "./pages/auth/UserLogin";
import Register from "./pages/auth/Register";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UserDashboard from "./pages/user
