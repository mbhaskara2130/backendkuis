import { getDb } from '../config/db.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { signJwt } from '../utils/jwt.js'

export async function register(req, res) {
  const { username, password, role } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username & password required' })
  }

  try {
    const db = getDb()
    const exists = await db.get('SELECT id FROM users WHERE username = ?', [username])
    if (exists) {
      return res.status(409).json({ error: 'username already exists' })
    }

    const password_hash = await hashPassword(password)
    // kalau role dikirim "admin" pakai admin, kalau tidak default user
    const userRole = role === 'admin' ? 'admin' : 'user'

    const r = await db.run(
      'INSERT INTO users (username, password_hash, role) VALUES (?,?,?)',
      [username, password_hash, userRole]
    )

    const user = { id: r.lastID, username, role: userRole }
    const token = signJwt(user)
    res.json({ user, token })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function login(req, res) {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username & password required' })
  }

  try {
    const db = getDb()
    const row = await db.get('SELECT * FROM users WHERE username = ?', [username])
    if (!row) return res.status(401).json({ error: 'invalid credentials' })

    const ok = await comparePassword(password, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const user = { id: row.id, username: row.username, role: row.role }
    const token = signJwt(user)
    res.json({ user, token })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
