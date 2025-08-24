import { getDb } from '../config/db.js'

export async function listQuizzes(req,res){
  try{
    const db = getDb()
    const rows = await db.all('SELECT id, title, description, is_public FROM quizzes ORDER BY id DESC')
    res.json(rows.map(r=>({ id:r.id, title:r.title, description:r.description, is_public: !!r.is_public })))
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function createQuiz(req,res){
  const { title, description, is_public = 1 } = req.body || {}
  if(!title) return res.status(400).json({ error: 'title required' })
  try{
    const db = getDb()
    const r = await db.run('INSERT INTO quizzes (title, description, is_public, created_by) VALUES (?,?,?,?)', [title, description||'', is_public?1:0, req.user?.id || null])
    res.status(201).json({ id: r.lastID, title, description, is_public: !!is_public })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function updateQuiz(req,res){
  const { id } = req.params
  const { title, description, is_public } = req.body || {}
  try{
    const db = getDb()
    const old = await db.get('SELECT * FROM quizzes WHERE id = ?', [id])
    if(!old) return res.status(404).json({ error: 'quiz not found' })
    const t = title ?? old.title
    const d = description ?? old.description
    const p = (is_public===undefined) ? old.is_public : (is_public?1:0)
    await db.run('UPDATE quizzes SET title=?, description=?, is_public=? WHERE id=?', [t,d,p,id])
    res.json({ id:Number(id), title:t, description:d, is_public: !!p })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function deleteQuiz(req,res){
  try{
    const db = getDb()
    const { id } = req.params
    const old = await db.get('SELECT id FROM quizzes WHERE id=?', [id])
    if(!old) return res.status(404).json({ error: 'quiz not found' })
    await db.run('DELETE FROM quizzes WHERE id=?', [id])
    res.json({ ok:true })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function getQuestions(req,res){
  try{
    const db = getDb()
    const { id } = req.params
    const quiz = await db.get('SELECT id FROM quizzes WHERE id=?', [id])
    if(!quiz) return res.status(404).json({ error: 'quiz not found' })
    const rows = await db.all('SELECT id, text, options_json FROM questions WHERE quiz_id=? ORDER BY id ASC', [id])
    const data = rows.map(r=>({ id:r.id, text:r.text, options: JSON.parse(r.options_json) }))
    res.json(data)
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function addQuestion(req,res){
  try{
    const db = getDb()
    const { id } = req.params
    const { text, options, correct_index } = req.body || {}
    if(!text || !Array.isArray(options) || options.length<2 || correct_index===undefined)
      return res.status(400).json({ error: 'text, options[], correct_index required' })
    const quiz = await db.get('SELECT id FROM quizzes WHERE id=?', [id])
    if(!quiz) return res.status(404).json({ error: 'quiz not found' })
    const r = await db.run('INSERT INTO questions (quiz_id, text, options_json, correct_index) VALUES (?,?,?,?)', [id, text, JSON.stringify(options), Number(correct_index)])
    res.status(201).json({ id: r.lastID })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function updateQuestion(req,res){
  try{
    const db = getDb()
    const { qid } = req.params
    const row = await db.get('SELECT * FROM questions WHERE id=?', [qid])
    if(!row) return res.status(404).json({ error: 'question not found' })
    let { text, options, correct_index } = req.body || {}
    const newText = text ?? row.text
    const newOpts = options ? JSON.stringify(options) : row.options_json
    const newIdx = (correct_index===undefined) ? row.correct_index : Number(correct_index)
    await db.run('UPDATE questions SET text=?, options_json=?, correct_index=? WHERE id=?', [newText, newOpts, newIdx, qid])
    res.json({ id: Number(qid) })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function deleteQuestion(req,res){
  try{
    const db = getDb()
    const { qid } = req.params
    const row = await db.get('SELECT id FROM questions WHERE id=?', [qid])
    if(!row) return res.status(404).json({ error: 'question not found' })
    await db.run('DELETE FROM questions WHERE id=?', [qid])
    res.json({ ok:true })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}