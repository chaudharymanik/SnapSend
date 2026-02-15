'use client';

import { useState } from 'react';
import { copyToClipboard, formatTimeRemaining } from '@/lib/utils';

interface ShareLinkDisplayProps {
    shareLink: string;
    expiresAt: string;
}

export default function ShareLinkDisplay({ shareLink, expiresAt }: ShareLinkDisplayProps) {
    const [copied, setCopied] = useState(false);

    const fullLink = `${window.location.origin}/share/${shareLink}`;

    const handleCopy = async () => {
        const success = await copyToClipboard(fullLink);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="share-card">
            <div className="share-card-header">
                <span className="share-icon">🔗</span>
                <h3>Your share link is ready!</h3>
            </div>

            <div className="share-link-row">
                <input
                    type="text"
                    className="share-link-input"
                    value={fullLink}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                    className={`btn-copy ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>

            <p className="share-expiry">
                ⏳ {formatTimeRemaining(expiresAt)} &nbsp;·&nbsp; Expires{' '}
                {new Date(expiresAt).toLocaleString()}
            </p>
        </div>
    );
}
