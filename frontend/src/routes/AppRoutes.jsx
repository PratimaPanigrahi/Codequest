// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../middleware/ProtectedRoute.jsx";
import RoleRoute from "../middleware/RoleRoute.jsx";
import Loader from "../components/ui/Loader.jsx";
import Layout from "../components/layout/Layout.jsx";

// Public Pages
const PublicHome = lazy(() => import("../pages/PublicHome.jsx"));
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));

// User Pages
const UserHome = lazy(() => import("../pages/UserHome.jsx"));
const Profile = lazy(() => import("../pages/auth/Profile.jsx"));
const LessonList = lazy(() => import("../pages/lessons/LessonList.jsx"));
const LessonDetail = lazy(() => import("../pages/lessons/LessonDetail.jsx"));
const QuizList = lazy(() => import("../pages/quizzes/QuizList.jsx"));
const QuizLevels = lazy(() => import("../pages/quizzes/QuizLevels.jsx"));
const QuizDetail = lazy(() => import("../pages/quizzes/QuizDetail.jsx"));
const ProgressDashboard = lazy(() => import("../pages/progress/ProgressDashboard.jsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const LessonManagement = lazy(() => import("../pages/admin/LessonManagement.jsx"));
const QuizManagement = lazy(() => import("../pages/admin/QuizManagement.jsx"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route
          path="/userhome"
          element={
            <ProtectedRoute>
              <Layout><UserHome /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Lessons */}
        <Route
          path="/lessons/:difficulty"
          element={
            <ProtectedRoute>
              <Layout><LessonList /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/lessons/detail/:id"
  element={
    <ProtectedRoute>
      <Layout><LessonDetail /></Layout>
    </ProtectedRoute>
  }
/>


        {/* Quizzes */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Layout><QuizList /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/levels"
          element={
            <ProtectedRoute>
              <Layout><QuizLevels /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:difficulty/:level"
          element={
            <ProtectedRoute>
              <Layout><QuizDetail /></Layout>
            </ProtectedRoute>
          }
        />

        {/* User Progress Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><ProgressDashboard /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin"><AdminDashboard /></RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lessons"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin"><LessonManagement /></RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin"><QuizManagement /></RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin"><UserManagement /></RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/progress"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin"><ProgressDashboard /></RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Redirect /admin → /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      </Routes>
    </Suspense>
  );
}
