import { Router } from 'express'
import { listUsers, listAdmins } from '../controllers/adminController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const r = Router()
r.get('/users', requireAuth, requireAdmin, listUsers)
r.get('/admins', requireAuth, requireAdmin, listAdmins)

export default r