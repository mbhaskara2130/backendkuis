import { getDb } from '../config/db.js'

// Leaderboard list
// Leaderboard list (best score per user + quiz name)
export async function leaderboard(req, res) {
  try {
    const db = getDb()
    const { quizId } = req.query
    const args = []

    const sql = `
      WITH best_attempt AS (
        SELECT a.user_id, a.quiz_id, MAX(a.score) AS best_score
        FROM attempts a
        ${quizId ? 'WHERE a.quiz_id = ?' : ''}
        GROUP BY a.user_id ${quizId ? ', a.quiz_id' : ''}
      )
      SELECT u.username,
             q.title AS best_quiz,
             b.best_score
      FROM best_attempt b
      JOIN users u ON u.id = b.user_id
      JOIN quizzes q ON q.id = b.quiz_id
      ORDER BY b.best_score DESC, u.username ASC
      LIMIT 100
    `
    if (quizId) args.push(quizId)

    const rows = await db.all(sql, args)

    const data = rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      best_score: r.best_score,
      best_quiz: r.best_quiz
    }))

    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}



// Rank user login
// Rank user login (harus konsisten dengan leaderboard)
// gantikan seluruh fungsi myRank dengan ini
export async function myRank(req, res) {
  try {
    const db = getDb()
    if (!req.user) return res.status(401).json({ error: 'auth required' })

    const { quizId } = req.query
    const args = []

    const sql = `
      WITH best_attempt AS (
        SELECT a.user_id, a.quiz_id, MAX(a.score) AS best_score
        FROM attempts a
        ${quizId ? 'WHERE a.quiz_id = ?' : ''}
        GROUP BY a.user_id ${quizId ? ', a.quiz_id' : ''}
      )
      SELECT u.id as user_id,
             u.username,
             q.title AS best_quiz,
             b.best_score
      FROM best_attempt b
      JOIN users u ON u.id = b.user_id
      JOIN quizzes q ON q.id = b.quiz_id
      ORDER BY b.best_score DESC, u.username ASC
    `
    if (quizId) args.push(quizId)

    const rows = await db.all(sql, args)

    const idx = rows.findIndex(r => r.user_id === req.user.id)

    // hitung total entries user
    const totalQ = `
      SELECT COUNT(*) as c
      FROM attempts
      WHERE user_id = ?
      ${quizId ? 'AND quiz_id = ?' : ''}
    `
    const total = await db.get(totalQ, quizId ? [req.user.id, quizId] : [req.user.id])

    if (idx === -1) {
      return res.json({
        username: req.user.username,
        best_score: null,
        best_quiz: null,
        rank: null,
        total_entries: total.c
      })
    }

    const row = rows[idx]
    const rank = idx + 1

    res.json({
      username: row.username,
      best_score: row.best_score,
      best_quiz: row.best_quiz,
      rank,
      total_entries: total.c
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
