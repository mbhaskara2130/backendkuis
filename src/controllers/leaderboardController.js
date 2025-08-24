import { getDb } from '../config/db.js'

export async function leaderboard(req,res){
  try{
    const db = getDb()
    const { quizId } = req.query
    const args = []
    let sql = `
      SELECT a.id as attempt_id,
             COALESCE(u.username, a.guest_name) as name,
             a.score,
             a.created_at
      FROM attempts a
      LEFT JOIN users u ON u.id = a.user_id
    `
    if(quizId){
      sql += ' WHERE a.quiz_id = ? '
      args.push(quizId)
    }
    sql += ' ORDER BY a.score DESC, a.created_at ASC LIMIT 100'
    const rows = await db.all(sql, args)
    const data = rows.map((r,i)=>({ rank: i+1, attempt_id: r.attempt_id, name: r.name, score: r.score, when: r.created_at }))
    res.json(data)
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function myRank(req,res){
  try{
    const db = getDb()
    const { id } = req.user
    const total = await db.get('SELECT COUNT(*) as c FROM attempts WHERE user_id IS NOT NULL')
    const rows = await db.all(`
      SELECT a.id as attempt_id, a.score, a.created_at
      FROM attempts a WHERE a.user_id = ? ORDER BY a.score DESC, a.created_at ASC
    `, [id])
    if(rows.length === 0) return res.json({ username: req.user.username, rank: null, total_entries: total.c })
    const bestScore = rows[0].score
    // compute rank among all attempts by score
    const higher = await db.get('SELECT COUNT(*) as c FROM attempts WHERE score > ? AND user_id IS NOT NULL', [bestScore])
    const rank = higher.c + 1
    res.json({ username: req.user.username, best_score: bestScore, rank, total_entries: total.c })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}