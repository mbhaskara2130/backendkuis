import { Router } from 'express'
import { listQuizzes, createQuiz, updateQuiz, deleteQuiz, getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../controllers/quizController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const r = Router()

r.get('/', listQuizzes)
r.get('/:id/questions', getQuestions)

r.post('/', requireAuth, requireAdmin, createQuiz)
r.put('/:id', requireAuth, requireAdmin, updateQuiz)
r.delete('/:id', requireAuth, requireAdmin, deleteQuiz)

r.post('/:id/questions', requireAuth, requireAdmin, addQuestion)
r.put('/questions/:qid', requireAuth, requireAdmin, updateQuestion)
r.delete('/questions/:qid', requireAuth, requireAdmin, deleteQuestion)

export default r