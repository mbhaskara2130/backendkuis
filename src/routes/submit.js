import { Router } from 'express'
import { submitQuiz } from '../controllers/submitController.js'
import { optionalAuth } from '../middleware/auth.js'

const r = Router()

// submit supports guest or logged-in user
r.post('/:quizId', optionalAuth, submitQuiz)

export default r
