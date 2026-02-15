'use client';

import { useState, useRef, DragEvent } from 'react';
import { requestUpload, confirmUpload } from '@/lib/api';
import { uploadToS3 } from '@/lib/s3Client';
import { formatFileSize } from '@/lib/utils';
import { EXPIRY_OPTIONS, MAX_FILE_SIZE, UploadStatus } from '@/types';
import ProgressBar from './ProgressBar';
import ShareLinkDisplay from './ShareLinkDisplay';

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [expiryHours, setExpiryHours] = useState(24);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [shareLink, setShareLink] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setFile(null);
        setProgress(0);
        setStatus('idle');
        setShareLink('');
        setExpiresAt('');
        setError('');
        if (inputRef.current) inputRef.current.value = '';
    };

    const validateFile = (f: File): string | null => {
        if (f.size > MAX_FILE_SIZE) {
            return `File is too large. Max size is ${formatFileSize(MAX_FILE_SIZE)}.`;
        }
        if (f.size === 0) {
            return 'File is empty.';
        }
        return null;
    };

    const handleFileSelect = (f: File) => {
        const err = validateFile(f);
        if (err) {
            setError(err);
            return;
        }
        setError('');
        setFile(f);
        setStatus('idle');
        setShareLink('');
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFileSelect(f);
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileSelect(f);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            // Step 1: request pre-signed URL
            setStatus('requesting');
            setError('');
            const data = await requestUpload(file, expiryHours);

            // Step 2: upload directly to S3
            setStatus('uploading');
            await uploadToS3(file, data.uploadUrl, setProgress);

            // Step 3: confirm upload
            setStatus('confirming');
            await confirmUpload(data.fileId);

            // Done!
            setStatus('done');
            setShareLink(data.shareLink);
            setExpiresAt(data.expiresAt);
        } catch (err: unknown) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Upload failed');
        }
    };

    return (
        <section className="uploader-section">
            {/* Drop zone */}
            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="file-input-hidden"
                    onChange={onInputChange}
                />

                {file ? (
                    <div className="selected-file">
                        <div className="selected-file-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div>
                            <p className="selected-file-name">{file.name}</p>
                            <p className="selected-file-size">{formatFileSize(file.size)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="drop-zone-placeholder">
                        <div className="drop-zone-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <p className="drop-zone-text">
                            Drag &amp; drop your file here, or <span className="link-text">browse</span>
                        </p>
                        <p className="drop-zone-hint">Max {formatFileSize(MAX_FILE_SIZE)}</p>
                    </div>
                )}
            </div>

            {/* Expiry selector */}
            <div className="expiry-row">
                <label htmlFor="expiry" className="expiry-label">
                    Link expires in:
                </label>
                <div className="expiry-options">
                    {EXPIRY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`expiry-chip ${expiryHours === opt.value ? 'active' : ''}`}
                            onClick={() => setExpiryHours(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Upload button */}
            <button
                className="btn-upload"
                disabled={!file || status === 'uploading' || status === 'requesting' || status === 'confirming'}
                onClick={handleUpload}
            >
                {status === 'idle' && 'Upload & Get Link'}
                {status === 'requesting' && 'Preparing…'}
                {status === 'uploading' && 'Uploading…'}
                {status === 'confirming' && 'Confirming…'}
                {status === 'done' && 'Uploaded!'}
                {status === 'error' && 'Retry Upload'}
            </button>

            {/* Progress */}
            {(status === 'uploading' || status === 'confirming') && (
                <ProgressBar percent={progress} label="Uploading to cloud…" />
            )}

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Share link result */}
            {status === 'done' && shareLink && (
                <>
                    <ShareLinkDisplay shareLink={shareLink} expiresAt={expiresAt} />
                    <button className="btn-secondary" onClick={resetState}>
                        Upload Another File
                    </button>
                </>
            )}
        </section>
    );
}
