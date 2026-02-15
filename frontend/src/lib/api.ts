import {
    UploadRequest,
    UploadResponse,
    ConfirmResponse,
    FileInfo,
    DownloadResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Request a pre-signed upload URL from the backend.
 */
export async function requestUpload(
    file: File,
    expiryHours: number
): Promise<UploadResponse> {
    const body: UploadRequest = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        expiryHours,
    };

    const res = await fetch(`${API_URL}/api/upload/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload request failed');
    }

    return res.json();
}

/**
 * Confirm that the file was uploaded to S3 successfully.
 */
export async function confirmUpload(fileId: string): Promise<ConfirmResponse> {
    const res = await fetch(`${API_URL}/api/upload/confirm/${fileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload confirmation failed');
    }

    return res.json();
}

/**
 * Validate a share link and get file info.
 */
export async function getShareInfo(linkId: string): Promise<FileInfo> {
    const res = await fetch(`${API_URL}/api/share/${linkId}`);

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Link is invalid or expired');
    }

    return res.json();
}

/**
 * Get a pre-signed download URL.
 */
export async function getDownloadUrl(linkId: string): Promise<DownloadResponse> {
    const res = await fetch(`${API_URL}/api/download/${linkId}`);

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Download failed');
    }

    return res.json();
}
