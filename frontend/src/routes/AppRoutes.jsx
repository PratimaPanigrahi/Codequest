// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../middleware/ProtectedRoute.jsx";
import RoleRoute from "../middleware/RoleRoute.jsx";
import Loader from "../components/ui/Loader.jsx";
import Layout from "../components/layout/Layout.jsx";

// ----- Lazy-loaded Pages -----
const PublicHome = lazy(() => import("../pages/PublicHome.jsx"));
const UserHome = lazy(() => import("../pages/UserHome.jsx"));
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));
const Profile = lazy(() => import("../pages/auth/Profile.jsx"));
const Courses = lazy(() => import("../pages/auth/Courses.jsx"));
const LessonList = lazy(() => import("../pages/lessons/LessonList.jsx"));
const LessonDetail = lazy(() => import("../pages/lessons/LessonDetail.jsx"));
const QuizList = lazy(() => import("../pages/quizzes/QuizList.jsx"));
const QuizDetail = lazy(() => import("../pages/quizzes/QuizDetail.jsx"));
const ProgressDashboard = lazy(() => import("../pages/progress/ProgressDashboard.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const LessonManagement = lazy(() => import("../pages/admin/LessonManagement.jsx"));
const QuizManagement = lazy(() => import("../pages/admin/QuizManagement.jsx"));
const RoadmapManagement = lazy(() => import("../pages/admin/RoadmapManagement.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages with Layout */}
        <Route
          path="/userhome"
          element={
            <ProtectedRoute>
              <Layout>
                <UserHome />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Layout>
                <Courses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Layout>
                <LessonList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <LessonDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Layout>
                <QuizList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <QuizDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <ProgressDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Pages */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/lessons"
          element={
            <RoleRoute role="admin">
              <LessonManagement />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <RoleRoute role="admin">
              <QuizManagement />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/roadmaps"
          element={
            <RoleRoute role="admin">
              <RoadmapManagement />
            </RoleRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
