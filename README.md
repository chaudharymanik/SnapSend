# QuickShare — Zero-Cost File Sharing Platform

A production-ready file sharing web application with time-based expiring links, built on a zero-cost AWS architecture.

## ⚡ Features

- **Drag & drop uploads** with real-time progress tracking
- **Pre-signed URLs** — files transfer directly between browser and S3 (no server proxy)
- **Expiring share links** — choose from 1 hour to 1 week
- **Premium dark-mode UI** with glassmorphism and micro-animations
- **Rate limiting** to stay within AWS free tier
- **Automatic cleanup** via S3 lifecycle policies + database cron jobs
- **Security**: input validation, MIME type filtering, sanitized filenames, Helmet.js headers

## 🏗️ Architecture

```
┌─────────────┐    pre-signed URL     ┌──────────┐
│   Next.js   │ ◄───────────────────► │  AWS S3  │
│  (Vercel)   │   direct upload/dl    │ (5GB free)│
└──────┬──────┘                       └──────────┘
       │ API calls
       ▼
┌──────────────┐     queries     ┌───────────────┐
│  Express.js  │ ◄─────────────► │ MongoDB Atlas │
│  (Railway)   │                 │  (512MB free) │
└──────────────┘                 └───────────────┘
```

**Key principle:** The backend NEVER proxies file data. All file transfers happen directly between the client and S3 via pre-signed URLs.

## 📁 Project Structure

```
file-sharing-app/
├── frontend/          # Next.js 14+ (App Router, TypeScript)
│   └── src/
│       ├── app/       # Pages (home, upload, share/[linkId])
│       ├── components/# FileUploader, ShareLinkDisplay, FileDownload, ProgressBar
│       ├── lib/       # API client, S3 upload, utilities
│       └── types/     # TypeScript interfaces
├── backend/           # Express.js REST API
│   └── src/
│       ├── config/    # database, s3, constants
│       ├── models/    # Mongoose schemas
│       ├── controllers/# upload, share, download logic
│       ├── routes/    # Express routes
│       ├── middleware/ # rate limiter, validation, error handler
│       ├── services/  # S3 service, link generation, expiry cron
│       └── utils/     # crypto, file validator
└── docs/              # SETUP.md, ARCHITECTURE.md, API.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [download](https://nodejs.org/)
- **AWS account** with free tier — [sign up](https://aws.amazon.com/free/)
- **MongoDB Atlas** free cluster — [sign up](https://www.mongodb.com/cloud/atlas)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd file-sharing-app

# Backend
cd backend
npm install
cp .env.example .env    # Fill in your credentials

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local
```

### 2. Configure AWS & MongoDB

Follow the detailed [Setup Guide](docs/SETUP.md) to:
- Create an S3 bucket with CORS and lifecycle rules
- Create an IAM user with minimal permissions
- Set up MongoDB Atlas free cluster
- Fill in all `.env` values

### 3. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev     # http://localhost:3000
```

## 🔧 Tech Stack

| Layer    | Technology          | Hosting           |
|----------|--------------------|--------------------|
| Frontend | Next.js 14, TypeScript | Vercel (free) |
| Backend  | Express.js, Node.js   | Railway.app (free) |
| Database | MongoDB Atlas         | Atlas (free 512MB) |
| Storage  | AWS S3                | Free tier (5GB)    |

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) — Step-by-step AWS, MongoDB, and deployment setup
- [Architecture](docs/ARCHITECTURE.md) — System design and data flow
- [API Reference](docs/API.md) — Complete REST API documentation

## 📄 License

MIT
