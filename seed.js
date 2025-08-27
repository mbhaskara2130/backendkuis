import dotenv from 'dotenv'
dotenv.config()
import { initDb, getDb } from './src/config/db.js'
import { hashPassword } from './src/utils/hash.js'

async function run() {
  await initDb()
  const db = getDb()

  // table users sudah harus punya kolom role
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'user'
    )
  `)

  // create admin if not exists
  const adminUser = await db.get('SELECT id FROM users WHERE username = ?', ['admin'])
  if (!adminUser) {
    const password_hash = await hashPassword('admin123')
    await db.run(
      'INSERT INTO users (username, password_hash, role) VALUES (?,?,?)',
      ['admin', password_hash, 'admin']
    )
    console.log('Seeded admin: admin / admin123 (please change in production)')
  } else {
    console.log('Admin already exists')
  }

  // sample quiz
  const sample = await db.get('SELECT id FROM quizzes WHERE title=?', ['Contoh Kuis'])
  let quizId
  if (!sample) {
    const r = await db.run(
      'INSERT INTO quizzes (title, description, is_public, created_by) VALUES (?,?,?,?)',
      ['Contoh Kuis', 'Kuis contoh seeded', 1, null]
    )
    quizId = r.lastID
    await db.run(
      'INSERT INTO questions (quiz_id, text, options_json, correct_index) VALUES (?,?,?,?)',
      [quizId, 'Ibu kota Indonesia?', JSON.stringify(['Bandung','Jakarta','Surabaya','Medan']), 1]
    )
    await db.run(
      'INSERT INTO questions (quiz_id, text, options_json, correct_index) VALUES (?,?,?,?)',
      [quizId, '2 + 2 = ?', JSON.stringify(['3','4','5','2']), 1]
    )
    console.log('Seeded sample quiz with 2 questions.')
  } else {
    quizId = sample.id
    console.log('Sample quiz already exists (id=' + quizId + ')')
  }

  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
