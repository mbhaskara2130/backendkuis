import jwt from 'jsonwebtoken'

export function signJwt(payload) {
  const secret = process.env.JWT_SECRET
  console.log("DEBUG signJwt - JWT_SECRET:", secret)   // <--- tambahin
  return jwt.sign(payload, secret, { expiresIn: '2d' })
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET
  console.log("DEBUG verifyJwt - JWT_SECRET:", secret) // <--- tambahin
  return jwt.verify(token, secret)
}
