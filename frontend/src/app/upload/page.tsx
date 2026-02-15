import FileUploader from '@/components/FileUploader';

export const metadata = {
    title: 'Send a File — SnapSend',
    description: 'Upload a file and generate a secure expiring share link.',
};

export default function UploadPage() {
    return (
        <div className="upload-page">
            <div className="upload-page-header">
                <h1>Send a file</h1>
                <p>Your file is uploaded directly to the cloud. We never see your data.</p>
            </div>
            <FileUploader />
        </div>
    );
}
