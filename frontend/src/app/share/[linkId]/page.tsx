'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getShareInfo } from '@/lib/api';
import { FileInfo } from '@/types';
import FileDownload from '@/components/FileDownload';

export default function SharePage() {
    const params = useParams();
    const linkId = params.linkId as string;

    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!linkId) return;

        async function load() {
            try {
                const info = await getShareInfo(linkId);
                setFileInfo(info);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Link is invalid or expired');
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [linkId]);

    if (loading) {
        return (
            <div className="share-page">
                <div className="loading-card">
                    <div className="spinner-large" />
                    <p>Validating link…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="share-page">
                <div className="error-card">
                    <span className="error-icon">❌</span>
                    <h2>Link Expired or Invalid</h2>
                    <p>{error}</p>
                    <a href="/upload" className="btn-secondary">
                        Upload a new file →
                    </a>
                </div>
            </div>
        );
    }

    if (!fileInfo) return null;

    return (
        <div className="share-page">
            <FileDownload fileInfo={fileInfo} linkId={linkId} />
        </div>
    );
}
