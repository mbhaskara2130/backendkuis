import { Router } from 'express'
import { leaderboard, myRank } from '../controllers/leaderboardController.js'
import { requireAuth } from '../middleware/auth.js'

const r = Router()
r.get('/', leaderboard)
r.get('/me', requireAuth, myRank)

export default r