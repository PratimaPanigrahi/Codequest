import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import lessonReducer from './lessonSlice.js'
import quizReducer from './quizSlice.js'
import progressReducer from './progressSlice.js'
import roadmapReducer from './roadmapSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    lesson: lessonReducer,
    quiz: quizReducer,
    progress: progressReducer,
    roadmap: roadmapReducer,
  },
})


export default store
