import { Router } from 'express'
import authRoutes from './auth.js'
import quizRoutes from './quizzes.js'
import leaderboardRoutes from './leaderboard.js'
import mylearningRoutes from './mylearning.js'
import submitRoutes from './submit.js'
import adminRoutes from './admin.js'

const r = Router()

r.use('/auth', authRoutes)
r.use('/quizzes', quizRoutes)
r.use('/leaderboard', leaderboardRoutes)
r.use('/mylearning', mylearningRoutes)
r.use('/submit', submitRoutes)
r.use('/admin', adminRoutes)

export default r