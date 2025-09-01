import { Router } from "express"
import { myLearning } from "../controllers/myLearningController.js"
import { requireAuth } from "../middleware/auth.js"

const r = Router()

// proteksi route dengan requireAuth
r.get("/", requireAuth, myLearning)

export default r
