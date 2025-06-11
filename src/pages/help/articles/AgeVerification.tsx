import React from 'react';

const AgeVerification: React.FC = () => {
  return (
    <div className="prose max-w-none p-4">
      <h1>Age Verification Process</h1>
      <p>
        To comply with legal requirements, we require all users to verify their age before accessing adult content.
      </p>
      <h2>How to Verify Your Age</h2>
      <ol>
        <li>Navigate to your account settings.</li>
        <li>Upload a valid government-issued ID.</li>
        <li>Wait for our team to review and approve your verification.</li>
      </ol>
      <h2>Privacy and Security</h2>
      <p>
        Your personal information and documents are securely stored and only used for verification purposes.
      </p>
    </div>
  );
};

export default AgeVerification;
