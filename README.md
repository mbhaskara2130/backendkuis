# KuisPintar Backend — Express + SQLite + Dockerfile

## Fitur
- Auth (register/login) + JWT + role (`user` / `admin`)
- Guest bisa submit kuis (auto nama `GuestXXXX`)
- Leaderboard (global / `?quizId=`) + `GET /api/leaderboard/me` (login)
- My Learning / History hasil user (`GET /api/mylearning`)
- Admin: CRUD quiz & question + lihat user/admin
- Skor setelah submit: username, benar, salah, score

## Jalankan Lokal
```bash
cp .env.example .env
npm install
npm run seed     # admin: admin/admin123 + kuis contoh
npm start        # http://localhost:3000
```

## Docker
```bash
docker build -t kuispintar-backend .
docker run -d --name kuispintar-backend -p 3000:3000 \
  -e JWT_SECRET="ganti_ini" -e PORT=3000 \
  -v kuispintar_data:/app/data \
  kuispintar-backend
```

## Endpoint Utama
- `POST /api/auth/register` — body `{ username, password }`
- `POST /api/auth/login` — body `{ username, password }` → `{ user, token }`
- `GET /api/quizzes`
- `GET /api/quizzes/:id/questions` — tanpa kunci jawaban
- `POST /api/quizzes` (admin) — `{ title, description, is_public }`
- `PUT /api/quizzes/:id` (admin)
- `DELETE /api/quizzes/:id` (admin)
- `POST /api/quizzes/:id/questions` (admin) — `{ text, options[], correct_index }`
- `PUT /api/quizzes/questions/:qid` (admin)
- `DELETE /api/quizzes/questions/:qid` (admin)
- `POST /api/submit/:quizId` — body `{ answers: { [questionId]: selectedIndex } }` — **guest atau user login**
- `GET /api/leaderboard` — optional `?quizId=ID`
- `GET /api/leaderboard/me` (login)
- `GET /api/mylearning` (login)
- `GET /api/admin/users` (admin)
- `GET /api/admin/admins` (admin)

## Contoh Quick Test (curl)
```bash
# register
curl -s -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"saya","password":"pass123"}'

# login
curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'

# list quizzes
curl -s http://localhost:3000/api/quizzes

# get questions (quiz 1)
curl -s http://localhost:3000/api/quizzes/1/questions

# submit as guest
curl -s -X POST http://localhost:3000/api/submit/1 -H "Content-Type: application/json" -d '{"answers":{"1":1,"2":1}}'

# leaderboard
curl -s http://localhost:3000/api/leaderboard
```

## Catatan
- **Ganti `JWT_SECRET`** sebelum produksi.
- Data SQLite tersimpan di folder `data/` (persist kalau pakai volume).
- Password admin seed: `admin123` — **wajib diganti di produksi**.