import { verifyJwt } from '../utils/jwt.js'

export function requireAuth(req,res,next){
  const hdr = req.headers['authorization'] || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if(!token) return res.status(401).json({ error: 'Unauthorized' })
  try{
    const payload = verifyJwt(token)
    req.user = payload
    next()
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req,res,next){
  if(!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}