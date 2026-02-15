'use client';

interface ProgressBarProps {
    percent: number;
    label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
    return (
        <div className="progress-container">
            {label && <p className="progress-label">{label}</p>}
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>
            <span className="progress-text">{percent}%</span>
        </div>
    );
}
