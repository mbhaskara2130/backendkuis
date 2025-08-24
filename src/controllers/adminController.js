import { getDb } from '../config/db.js'

export async function listUsers(req,res){
  try{
    const db = getDb()
    const rows = await db.all('SELECT id, username, role, created_at FROM users ORDER BY id ASC')
    res.json(rows)
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}

export async function listAdmins(req,res){
  try{
    const db = getDb()
    const rows = await db.all('SELECT id, username, role, created_at FROM users WHERE role="admin" ORDER BY id ASC')
    res.json(rows)
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}