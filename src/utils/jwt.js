import jwt from 'jsonwebtoken'

export function signJwt(payload){
  const secret = process.env.JWT_SECRET
  return jwt.sign(payload, secret, { expiresIn: '2d' })
}

export function verifyJwt(token){
  const secret = process.env.JWT_SECRET
  return jwt.verify(token, secret)
}