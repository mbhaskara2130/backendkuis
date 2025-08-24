import { Router } from 'express'
import { myLearning } from '../controllers/mylearningController.js'
import { requireAuth } from '../middleware/auth.js'

const r = Router()
r.get('/', requireAuth, myLearning)

export default r