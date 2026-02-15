# API Reference

**Base URL**: `http://localhost:5000` (development) or your Railway.app URL (production)

---

## Upload

### `POST /api/upload/request`

Request a pre-signed URL for direct S3 upload.

**Rate limit**: 10 requests per IP per 24 hours

**Request body**:
```json
{
  "fileName": "document.pdf",
  "fileSize": 1048576,
  "mimeType": "application/pdf",
  "expiryHours": 24
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `fileName` | string | 1–255 chars |
| `fileSize` | integer | 1 byte – 50MB (52428800) |
| `mimeType` | string | Must match allowed MIME types |
| `expiryHours` | integer | One of: 1, 6, 24, 72, 168 |

**Response** `201`:
```json
{
  "uploadUrl": "https://your-bucket.s3.amazonaws.com/uploads/abc123/document.pdf?X-Amz-...",
  "fileId": "a1b2c3d4e5f6...",
  "s3Key": "uploads/a1b2c3d4e5f6/document.pdf",
  "shareLink": "xy9aB3cDef12",
  "expiresAt": "2026-02-16T10:30:00.000Z"
}
```

**Errors**: `400` (validation), `429` (rate limit), `500` (server error)

---

### `POST /api/upload/confirm/:fileId`

Confirm that the file was uploaded to S3 successfully.

**Response** `200`:
```json
{
  "message": "Upload confirmed",
  "shareLink": "xy9aB3cDef12",
  "expiresAt": "2026-02-16T10:30:00.000Z"
}
```

**Errors**: `404` (file not found), `500` (server error)

---

## Share

### `GET /api/share/:linkId`

Validate a share link and return file metadata.

**Response** `200`:
```json
{
  "fileId": "a1b2c3d4e5f6...",
  "originalName": "document.pdf",
  "fileSize": 1048576,
  "mimeType": "application/pdf",
  "expiresAt": "2026-02-16T10:30:00.000Z",
  "downloadCount": 3,
  "uploadedAt": "2026-02-15T10:30:00.000Z"
}
```

**Errors**: `404` (not found), `410` (expired), `403` (download limit reached)

---

## Download

### `GET /api/download/:linkId`

Generate a pre-signed download URL (valid for 5 minutes).

**Rate limit**: 20 requests per IP per 15 minutes

**Response** `200`:
```json
{
  "downloadUrl": "https://your-bucket.s3.amazonaws.com/uploads/abc123/document.pdf?X-Amz-...",
  "expiresIn": 300
}
```

**Errors**: `404` (not found), `410` (expired), `403` (download limit), `429` (rate limit)

---

## Health Check

### `GET /health`

```json
{
  "status": "ok",
  "timestamp": "2026-02-15T10:30:00.000Z"
}
```
