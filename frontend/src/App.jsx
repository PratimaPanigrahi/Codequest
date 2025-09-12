import React from 'react'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      {/* Main Routes */}
      <AppRoutes />

      {/* Footer (optional, can move to Layout later) */}
      <footer className="footer mt-auto py-3 bg-light text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} CodeQuest. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
