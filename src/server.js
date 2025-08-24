import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { initDb } from './config/db.js'
import apiRoutes from './routes/index.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

await initDb()

app.get('/', (req,res)=> res.json({ ok:true, name:'KuisPintar Backend', version:'1.0.0' }))

app.use('/api', apiRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})