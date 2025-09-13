// src/pages/Home.jsx
import React, { useEffect, useState, Suspense } from 'react'
import api from '../api/axios.js'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Loader from '../components/ui/Loader.jsx'
import Toast from '../components/ui/Toast.jsx'

// Lazy load feature sections (ensure default exports!)
const RoadmapSection = React.lazy(() => import('../components/sections/RoadmapSection.jsx'))
const LessonsSection = React.lazy(() => import('../components/sections/LessonsSection.jsx'))
const QuizzesSection = React.lazy(() => import('../components/sections/QuizzesSection.jsx'))
const AchievementsSection = React.lazy(() => import('../components/sections/AchievementsSection.jsx'))
const LeaderboardSection = React.lazy(() => import('../components/sections/LeaderboardSection.jsx'))

const Home = () => {
  const [user, setUser] = useState({})
  const [roadmaps, setRoadmaps] = useState([])
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get user safely
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setUser(userData || {})

        // Fetch API data safely
        const [roadmapRes, lessonsRes, quizzesRes, notificationsRes] = await Promise.all([
          api.get('/roadmaps'),
          api.get('/lessons'),
          api.get('/quizzes'),
          api.get('/notifications').catch(() => ({ data: [] })) // fallback
        ])

        setRoadmaps(Array.isArray(roadmapRes.data) ? roadmapRes.data : [])
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : [])
        setQuizzes(Array.isArray(quizzesRes.data) ? quizzesRes.data : [])
        setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : [])

      } catch (err) {
        setError(err?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loader />
  if (error) return <Toast message={error} type="error" />

  return (
    <DashboardLayout>
      <div className="home-page container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {typeof user.name === 'string' ? user.name : 'Learner'}!
        </h1>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications mb-6">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <ul className="list-disc list-inside">
              {notifications.map((note, index) => (
                <li key={note.id || index}>
                  {typeof note.message === 'string' ? note.message : JSON.stringify(note)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lazy-loaded sections */}
        <Suspense fallback={<Loader />}>
          <RoadmapSection roadmaps={roadmaps} user={user} />
          <LessonsSection lessons={lessons} />
          <QuizzesSection quizzes={quizzes} />
          <AchievementsSection user={user} />
          <LeaderboardSection />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

export default Home
