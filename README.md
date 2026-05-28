# 📄 Resume Analyzer

> An AI-powered resume analysis tool built with the MERN stack. Upload your resume and get instant feedback on skills, ATS compatibility, keyword matching, and improvement suggestions.

![Resume Analyzer Banner](https://via.placeholder.com/1200x400?text=Resume+Analyzer+–+Land+Your+Dream+Job)

---

## 🚀 Live Demo

- **Frontend:** [resume-analyzer.vercel.app](https://resume-analyzer.vercel.app) *(update with your URL)*
- **Backend API:** [resume-analyzer-api.onrender.com](https://resume-analyzer-api.onrender.com) *(update with your URL)*

---

## ✨ Features

- 📤 Upload resume (PDF / DOCX)
- 🤖 AI-powered analysis (skills extraction, ATS score, feedback)
- 🎯 Job description matching — see how well your resume fits a role
- 📝 Section-wise feedback (Summary, Experience, Skills, Education)
- 💡 Keyword suggestions to improve ATS ranking
- 👤 User authentication — save and revisit past analyses
- 📱 Responsive and clean UI

---

## 🛠️ Tech Stack

| Layer       | Technology                           |
|-------------|---------------------------------------|
| Frontend    | React.js, React Router, Tailwind CSS  |
| Backend     | Node.js, Express.js                   |
| Database    | MongoDB Atlas, Mongoose               |
| AI / NLP    | OpenAI API / Groq API (LLaMA 3)       |
| File Upload | Multer, pdf-parse / mammoth           |
| Auth        | JWT, bcryptjs                         |
| Deployment  | Vercel (frontend), Render (backend)   |

---

## 📁 Project Structure

```
ResumeAnalyzer/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── UploadForm.jsx
│       │   ├── AnalysisResult.jsx
│       │   ├── ScoreCard.jsx
│       │   └── FeedbackSection.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   └── Auth.jsx
│       └── App.jsx
├── server/                  # Express backend
│   ├── controllers/
│   │   ├── authController.js
│   │   └── analyzeController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Analysis.js
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   │   └── parseResume.js   # PDF/DOCX text extraction
│   └── index.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Groq API key (or OpenAI API key)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint               | Description                    | Auth Required |
|--------|------------------------|--------------------------------|---------------|
| POST   | `/api/auth/register`   | Register new user              | ❌            |
| POST   | `/api/auth/login`      | Login and get JWT token        | ❌            |
| POST   | `/api/analyze`         | Upload and analyze resume      | ✅            |
| GET    | `/api/analyze/history` | Get past analyses for user     | ✅            |
| DELETE | `/api/analyze/:id`     | Delete an analysis             | ✅            |

---

## 🌐 Deployment

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` in environment variables
4. Deploy

### Backend → Render

1. Push `server/` to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Set all environment variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `CLIENT_URL`)
4. Build: `npm install` | Start: `node index.js`

> ⚠️ Render free tier sleeps after inactivity — expect a ~30s cold start on first request.

---

## 🔮 Upcoming Features

- [ ] Google OAuth login
- [ ] LinkedIn profile import
- [ ] Multi-resume comparison
- [ ] Interview question generator based on resume
- [ ] Resume builder / export to PDF

---

## 📸 Screenshots

> *(Add screenshots here)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/your-username">Mohit</a></p>
