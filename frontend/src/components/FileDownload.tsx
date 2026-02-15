'use client';

import { useState } from 'react';
import { getDownloadUrl } from '@/lib/api';
import { formatFileSize, getFileIcon, formatTimeRemaining } from '@/lib/utils';
import { FileInfo } from '@/types';

interface FileDownloadProps {
    fileInfo: FileInfo;
    linkId: string;
}

export default function FileDownload({ fileInfo, linkId }: FileDownloadProps) {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async () => {
        setDownloading(true);
        setError('');
        try {
            const { downloadUrl } = await getDownloadUrl(linkId);
            // Open the pre-signed URL — browser downloads the file
            window.location.href = downloadUrl;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Download failed';
            setError(message);
        } finally {
            setTimeout(() => setDownloading(false), 2000);
        }
    };

    return (
        <div className="download-card">
            <div className="file-icon-large">{getFileIcon(fileInfo.mimeType)}</div>

            <h2 className="download-filename">{fileInfo.originalName}</h2>

            <div className="file-meta">
                <span className="meta-chip">{formatFileSize(fileInfo.fileSize)}</span>
                <span className="meta-chip">
                    {fileInfo.downloadCount} download{fileInfo.downloadCount !== 1 ? 's' : ''}
                </span>
                <span className="meta-chip">⏳ {formatTimeRemaining(fileInfo.expiresAt)}</span>
            </div>

            <button
                className="btn-download"
                onClick={handleDownload}
                disabled={downloading}
            >
                {downloading ? (
                    <>
                        <span className="spinner" /> Preparing…
                    </>
                ) : (
                    <>⬇ Download File</>
                )}
            </button>

            {error && <p className="error-text">{error}</p>}
        </div>
    );
}
