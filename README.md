
# 🧠 InterviewPro – AI-Powered Virtual Interview Simulator

**InterviewPro** is a comprehensive **AI-based virtual interview simulator** designed to replicate real-life technical and behavioral interview experiences. It helps users practice interviews in a fully automated environment, with role-specific questions and AI-powered evaluation to boost readiness and confidence.

---

## 🚀 Features

- 🎯 **Role-Based Interview Rounds**
  - Supports predefined roles (e.g., SDE, Data Analyst, Cybersecurity, etc.)
  - Each role contains custom question sets across multiple rounds

- 🧪 **Four Structured Rounds**
  1. **MCQ Round** – Evaluate theoretical knowledge using timed multiple-choice questions
  2. **Coding Round** – Solve programming problems with a real-time code editor (Monaco)
  3. **System Design Round** – Answer open-ended design questions with LLM-based scoring
  4. **Behavioral Round** – Respond to situational questions evaluated via BERT-based similarity models

- 🤖 **AI-Powered Scoring**
  - Uses models like BERT and cosine similarity for behavioral analysis
  - Technical scoring with expected outputs and keyword matching
  - Optional LLaMA/LLM feedback integration

- 📊 **Progress Report**
  - Displays scores per round and overall performance summary
  - Exportable as PDF

- 🔐 **Secure Auth System**
  - Custom authentication using Node.js/Express and MongoDB (no Supabase)
  - Email-based 2FA support for user validation

- ⚡ **Real-Time Fraud Detection System** (for banking-related roles)
  - Redis Streams + ML models + quantum crypto logging

---

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, Monaco Editor, ShadCN UI
- **Backend:** Node.js, Express, Python (FastAPI for AI scoring), Redis
- **Database:** MongoDB
- **AI/ML Models:** BERT, LLaMA (optional), XGBoost, Cosine Similarity, NER
- **Others:** Redis Streams, Email 2FA (SMTP), PDF Generation (jsPDF)

---

## 📂 Project Structure

```
InterviewPro/
├── frontend/               # React frontend with all UI components
├── backend/
│   ├── auth/               # Custom login/signup logic with MongoDB
│   ├── scoring-api/        # FastAPI for evaluating answers using BERT
│   └── fraud-detection/    # Real-time fraud monitoring microservice
├── data/
│   └── roles/              # JSON files containing question sets and metadata
└── README.md
```

---

## 🧠 How It Works

1. **User selects a role**
2. **Goes through all four interview rounds**
3. **Answers are scored using ML/AI models**
4. **Final progress report is shown and saved**
5. **Feedback is generated for improvement**

---

## 🔐 Authentication

- Secure login using JWTs and hashed passwords (bcrypt)
- Email-based OTP verification (2FA)
- Session tracking with MongoDB

---

## 📊 Scoring & Evaluation Logic

| Round            | Scoring Method                               |
|------------------|-----------------------------------------------|
| MCQ              | Answer-key mapping                            |
| Coding           | Test case-based evaluation                    |
| System Design    | LLaMA model or keyword + concept matching     |
| Behavioral       | Cosine similarity between user & ideal answer |

---

## 🎯 Use Cases

- College placement practice portals
- HR training tools for mock interviews
- Individual interview prep apps
- EdTech platforms with skill evaluation

---

## 📋 TODO / Roadmap

- ✅ Complete backend scoring pipeline (BERT + FastAPI)
- ✅ Real-time code execution support (Python, C++, Java)
- 🧠 Improve LLM feedback with few-shot prompting
- 📁 Allow users to save & track previous attempts
- 🌐 Build a public dashboard for recruiters

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Manoj Malipatil**  
Creator of InterviewPro – empowering students and professionals with AI interview prep.
