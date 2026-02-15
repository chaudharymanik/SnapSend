# Setup Guide

Complete step-by-step instructions to get QuickShare running locally and deployed to production.

---

## Prerequisites

Download and install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) (LTS recommended) |
| **Git** | Any | [git-scm.com](https://git-scm.com/) |
| **Code editor** | Any | [VS Code](https://code.visualstudio.com/) recommended |

You'll also create free accounts on:
- **AWS** — [aws.amazon.com/free](https://aws.amazon.com/free/)
- **MongoDB Atlas** — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: AWS S3 Bucket Setup (10 min)

### 1.1 Create the S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. **Bucket name**: `your-app-file-storage` (must be globally unique; add random numbers if taken)
4. **Region**: `us-east-1` (or closest to your users)
5. **Block all public access**: ✅ ENABLED (leave checked — this is correct!)
6. **Bucket Versioning**: Disabled
7. **Server-side encryption**: Enable with **SSE-S3** (free)
8. Click **Create bucket**

### 1.2 Configure CORS

1. Open your bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)** → **Edit**
3. Paste this JSON and save:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

> ⚠️ Replace `your-frontend-domain.vercel.app` with your actual Vercel URL after deploying.

### 1.3 Add Lifecycle Rule (Auto-Delete Old Files)

1. Open your bucket → **Management** tab
2. Click **Create lifecycle rule**
3. **Rule name**: `DeleteExpiredFiles`
4. **Apply to all objects with prefix**: `uploads/`
5. Under **Lifecycle rule actions**, check **Expire current versions of objects**
6. Set **Days after object creation**: `7`
7. Click **Create rule**

### 1.4 Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/) → **Users** → **Create user**
2. **User name**: `file-sharing-app-user`
3. Click **Next**
4. Choose **Attach policies directly** → **Create policy**
5. Switch to **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME",
      "Condition": {
        "StringLike": { "s3:prefix": ["uploads/*"] }
      }
    }
  ]
}
```

6. Replace `YOUR-BUCKET-NAME` with your actual bucket name
7. **Policy name**: `FileShareS3Access` → **Create policy**
8. Go back to create user, refresh policies, search & attach `FileShareS3Access`
9. Click **Create user**
10. Click the user → **Security credentials** → **Create access key**
11. Choose **Application running outside AWS** → **Create access key**
12. **⚠️ SAVE the Access Key ID and Secret Access Key** — you won't see the secret again!

---

## Step 2: MongoDB Atlas Setup (5 min)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → **Create a free cluster**
2. Choose **M0 Free** tier
3. **Cloud provider**: AWS, **Region**: us-east-1 (match your S3 region)
4. Click **Create Deployment**
5. Create a **Database User**:
   - Username: `fileshare-admin`
   - Password: (generate a strong password, save it)
6. Under **Network Access** → **Add IP Address**:
   - For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - For production: add your server's specific IP
7. Go to **Database** → **Connect** → **Drivers**
8. Copy the connection string, it looks like:
   ```
   mongodb+srv://fileshare-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your actual password and add the database name:
   ```
   mongodb+srv://fileshare-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fileshare?retryWrites=true&w=majority
   ```

---

## Step 3: Backend Setup (5 min)

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
```

Edit `backend/.env` with your real credentials:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://fileshare-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fileshare?retryWrites=true&w=majority

AWS_ACCESS_KEY_ID=AKIA...your-key...
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-app-file-storage

FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=52428800
```

Start the backend:

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
⏰ Expiry cron jobs started
✅ MongoDB connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

---

## Step 4: Frontend Setup (3 min)

```bash
cd frontend

# Install dependencies (already done during project creation, but run if needed)
npm install

# Create .env.local from template
cp .env.local.example .env.local
```

The default `.env.local` values work for local development. Start the frontend:

```bash
npm run dev
```

Open http://localhost:3000 — you should see the QuickShare home page!

---

## Step 5: Test End-to-End

1. **Upload test**: Go to http://localhost:3000/upload, select a small file (< 50MB), choose "1 hour" expiry, click Upload
2. **Share link test**: Copy the generated share link, open it in an incognito/different browser
3. **Download test**: Click Download on the share page, verify the file downloads correctly
4. **Expiry test**: Upload with 1-hour expiry, manually change `expiresAt` in MongoDB Atlas to a past date, try the share link again — should show "Link has expired"

---

## Step 6: Deploy to Production

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) → **Import** your GitHub repo
3. Select the `frontend` directory as the root
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = your backend production URL
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL
   - `NEXT_PUBLIC_MAX_FILE_SIZE` = `52428800`
5. Click **Deploy**

### Backend → Railway.app

1. Go to [railway.app](https://railway.app/) → **New Project** → **Deploy from GitHub**
2. Select the `backend` directory
3. Add all environment variables from your `.env` file
4. Update `FRONTEND_URL` to your Vercel URL
5. Railway assigns a URL — copy it
6. Go back to Vercel, update `NEXT_PUBLIC_API_URL` to the Railway URL
7. **Update S3 CORS**: Add your Vercel URL to `AllowedOrigins`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `CORS error` in browser | Check S3 CORS config has your frontend URL; check backend `FRONTEND_URL` env var |
| `403 Forbidden` on S3 upload | Verify IAM policy, bucket name, and region match your `.env` |
| `MongoDB connection error` | Check connection string, password, and IP whitelist in Atlas |
| Upload stuck at 0% | Check browser console for network errors; verify S3 CORS |
| `File type not allowed` | The file's MIME type isn't in the allowed list — check `constants.js` |
