# Architecture

## System Overview

QuickShare uses a **zero-cost AWS architecture** where the backend never proxies file data. All file transfers happen directly between the client browser and AWS S3 using pre-signed URLs.

## Data Flow

### Upload Flow

```
1. User selects file + expiry time
2. Frontend → POST /api/upload/request → Backend
3. Backend validates, creates DB record, generates pre-signed PUT URL
4. Backend → returns { uploadUrl, fileId, shareLink } → Frontend
5. Frontend → PUT file directly to S3 using uploadUrl
6. Frontend → POST /api/upload/confirm/:fileId → Backend
7. Backend marks file as uploaded, returns share link
```

### Download Flow

```
1. User visits /share/:linkId
2. Frontend → GET /api/share/:linkId → Backend
3. Backend validates expiry, returns file metadata
4. User clicks Download
5. Frontend → GET /api/download/:linkId → Backend
6. Backend validates again, generates pre-signed GET URL
7. Backend → returns { downloadUrl } → Frontend
8. Frontend redirects browser to downloadUrl → S3 serves file directly
```

## Why This Costs $0 on AWS

| What | Why Free |
|------|----------|
| **No EC2/Lambda** | Backend runs on Railway.app free tier |
| **No API Gateway** | Express handles API directly |
| **S3 storage** | Free tier: 5GB/month |
| **S3 PUT requests** | Free tier: 2,000/month |
| **S3 GET requests** | Free tier: 20,000/month |
| **S3 data transfer** | First 100GB/month free |
| **No cleanup Lambda** | S3 lifecycle rules handle deletion |

## Two-Layer Expiry System

**Layer 1 — Database (immediate)**:
- Backend checks `expiresAt` timestamp before every download URL generation
- Cron job marks expired files every hour

**Layer 2 — S3 Lifecycle (cleanup)**:
- S3 lifecycle rule deletes objects in `uploads/` after 7 days
- Runs daily, frees storage automatically
- No Lambda or manual intervention needed

## Security Model

- **Pre-signed URLs**: Short-lived (15 min upload, 5 min download)
- **No public S3 access**: Bucket blocks all public access
- **IAM least privilege**: Only `PutObject` and `GetObject` on `uploads/*`
- **Input validation**: express-validator on all inputs
- **MIME type filtering**: Blocked extensions (`.exe`, `.bat`, `.sh`, etc.)
- **Rate limiting**: 10 uploads/day/IP, 20 downloads/15min/IP
- **Helmet.js**: Security headers (HSTS, CSP, etc.)
- **CORS**: Only frontend origin allowed
