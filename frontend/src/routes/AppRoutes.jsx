// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute.jsx'
import RoleRoute from '../middleware/RoleRoute.jsx'
import Loader from '../components/ui/Loader.jsx'

// ----- Lazy-loaded Pages ----- //
// Public Pages
const PublicHome = lazy(() => import('../pages/PublicHome.jsx'))

// User Pages
const UserHome = lazy(() => import('../pages/UserHome.jsx')) // default export required

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
        {/* Public Landing Page */}
        <Route path="/" element={<PublicHome />} />

        {/* User Dashboard (Protected) */}
        <Route path="/userhome" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />

        {/* <Route path="/userhome" element={<UserHome />} />  */}


        {/* Auth Routes */}
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

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>}
        />
        <Route
          path="/admin/lessons"
          element={<RoleRoute role="admin"><LessonManagement /></RoleRoute>}
        />
        <Route
          path="/admin/quizzes"
          element={<RoleRoute role="admin"><QuizManagement /></RoleRoute>}
        />
        <Route
          path="/admin/roadmaps"
          element={<RoleRoute role="admin"><RoadmapManagement /></RoleRoute>}
        />
      </Routes>
    </Suspense>
  )
}
