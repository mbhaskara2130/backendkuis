import { getDb } from '../config/db.js'

function randomGuest(){
  const n = Math.floor(1000 + Math.random()*9000)
  return `Guest${n}`
}

export async function submitQuiz(req,res){
  try{
    const db = getDb()
    const { quizId } = req.params
    const quiz = await db.get('SELECT id FROM quizzes WHERE id=?', [quizId])
    if(!quiz) return res.status(404).json({ error: 'quiz not found' })
    const { answers } = req.body || {}
    if(!answers || typeof answers !== 'object') return res.status(400).json({ error: 'answers object required (questionId -> selectedIndex)' })
    const qs = await db.all('SELECT id, correct_index FROM questions WHERE quiz_id=?', [quizId])
    if(qs.length === 0) return res.status(400).json({ error: 'quiz has no questions' })
    let correct = 0, wrong = 0
    for(const q of qs){
      const sel = answers[q.id]
      if(sel === undefined || sel === null){ wrong++; continue }
      if(Number(sel) === Number(q.correct_index)) correct++; else wrong++
    }
    const score = Math.round((correct / qs.length) * 100)
    const isAuth = !!req.user
    const guest_name = isAuth ? null : randomGuest()
    const user_id = isAuth ? req.user.id : null
    const r = await db.run('INSERT INTO attempts (user_id, guest_name, quiz_id, correct_count, wrong_count, score) VALUES (?,?,?,?,?,?)',
      [user_id, guest_name, quizId, correct, wrong, score])
    const username = isAuth ? req.user.username : guest_name
    res.json({ attempt_id: r.lastID, username, correct, wrong, score })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}