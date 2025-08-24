import { Router } from 'express'
import { submitQuiz } from '../controllers/submitController.js'
import { requireAuth } from '../middleware/auth.js'

const r = Router()
// submit supports guest (no auth) and logged-in user (with auth). If token exists, middleware not required.
r.post('/:quizId', submitQuiz)

export default r