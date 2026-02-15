// ── Upload types ─────────────────────────────────────
export interface UploadRequest {
    fileName: string;
    fileSize: number;
    mimeType: string;
    expiryHours: number;
}

export interface UploadResponse {
    uploadUrl: string;
    fileId: string;
    s3Key: string;
    shareLink: string;
    expiresAt: string;
}

export interface ConfirmResponse {
    message: string;
    shareLink: string;
    expiresAt: string;
}

// ── Share / Download types ───────────────────────────
export interface FileInfo {
    fileId: string;
    originalName: string;
    fileSize: number;
    mimeType: string;
    expiresAt: string;
    downloadCount: number;
    uploadedAt: string;
}

export interface DownloadResponse {
    downloadUrl: string;
    expiresIn: number;
}

// ── UI State types ───────────────────────────────────
export type UploadStatus = 'idle' | 'requesting' | 'uploading' | 'confirming' | 'done' | 'error';

export interface ExpiryOption {
    label: string;
    value: number; // hours
}

export const EXPIRY_OPTIONS: ExpiryOption[] = [
    { label: '1 hour', value: 1 },
    { label: '6 hours', value: 6 },
    { label: '24 hours', value: 24 },
    { label: '3 days', value: 72 },
    { label: '1 week', value: 168 },
];

export const MAX_FILE_SIZE = parseInt(
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800',
    10
);
