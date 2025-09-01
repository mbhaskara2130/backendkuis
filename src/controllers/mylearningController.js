import { getDb } from '../config/db.js'

export async function myLearning(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'auth required' })
    const db = getDb()

    const rows = await db.all(`
      SELECT 
        q.id as quiz_id,
        q.title,
        q.description,
        a.score,
        a.correct_count,
        a.wrong_count,
        a.created_at
      FROM attempts a
      JOIN quizzes q ON q.id = a.quiz_id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id])

    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
