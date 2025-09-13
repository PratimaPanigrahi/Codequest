// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute.jsx'
import RoleRoute from '../middleware/RoleRoute.jsx'
import Loader from '../components/ui/Loader.jsx'

// Pages (lazy-loaded)
const Home = lazy(() => import('../pages/Home.jsx'))

// Auth
const Login = lazy(() => import('../pages/auth/Login.jsx'))
const Register = lazy(() => import('../pages/auth/Register.jsx'))
const Profile = lazy(() => import('../pages/auth/Profile.jsx'))

// Lessons
const LessonList = lazy(() => import('../pages/lessons/LessonList.jsx'))
const LessonDetail = lazy(() => import('../pages/lessons/LessonDetail.jsx'))

// Quizzes
const QuizList = lazy(() => import('../pages/quizzes/QuizList.jsx'))
const QuizDetail = lazy(() => import('../pages/quizzes/QuizDetail.jsx'))

// Progress
const ProgressDashboard = lazy(() => import('../pages/progress/ProgressDashboard.jsx'))

// Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))
const LessonManagement = lazy(() => import('../pages/admin/LessonManagement.jsx'))
const QuizManagement = lazy(() => import('../pages/admin/QuizManagement.jsx'))
const RoadmapManagement = lazy(() => import('../pages/admin/RoadmapManagement.jsx'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Lessons */}
        <Route path="/lessons" element={<ProtectedRoute><LessonList /></ProtectedRoute>} />
        <Route path="/lessons/:id" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />

        {/* Quizzes */}
        <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
        <Route path="/quizzes/:id" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />

        {/* Progress */}
        <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/lessons" element={<RoleRoute role="admin"><LessonManagement /></RoleRoute>} />
        <Route path="/admin/quizzes" element={<RoleRoute role="admin"><QuizManagement /></RoleRoute>} />
        <Route path="/admin/roadmaps" element={<RoleRoute role="admin"><RoadmapManagement /></RoleRoute>} />
      </Routes>
    </Suspense>
  )
}
