// src/services/index.js

import authService from './authService.js'
import lessonService from './lessonService.js'
import quizService from './quizService.js'
import progressService from './progressService.js'
import roadmapService from './roadmapService.js'

// Export all services from a single entry point
export {
  authService,
  lessonService,
  quizService,
  progressService,
  roadmapService
}
