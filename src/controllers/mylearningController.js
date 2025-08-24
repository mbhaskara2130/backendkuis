import { getDb } from '../config/db.js'

export async function myLearning(req,res){
  try{
    const db = getDb()
    const uid = req.user.id
    const rows = await db.all(`
      SELECT a.id as attempt_id, q.title as quiz_title, a.score, a.correct_count, a.wrong_count, a.created_at
      FROM attempts a
      JOIN quizzes q ON q.id = a.quiz_id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [uid])
    res.json(rows)
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}