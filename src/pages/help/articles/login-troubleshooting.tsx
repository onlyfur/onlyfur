import React from 'react';

const LoginTroubleshooting: React.FC = () => (
  <div>
    <h1>Login Troubleshooting</h1>
    <p><strong>Description:</strong> Common issues and solutions for login problems.</p>
    <h2>Common Issues</h2>
    <ul>
      <li>Incorrect email or password</li>
      <li>Account not verified</li>
      <li>Password reset not working</li>
      <li>Account locked due to too many failed attempts</li>
    </ul>
    <h2>Solutions</h2>
    <ol>
      <li>Double-check your email and password for typos.</li>
      <li>Use the <strong>Forgot Password</strong> link to reset your password.</li>
      <li>Check your email (including spam) for verification or reset links.</li>
      <li>If your account is locked, wait 15 minutes or contact support.</li>
    </ol>
    <h2>Contact Support</h2>
    <p>If you continue to have issues, contact <a href="mailto:support@onlyfur.com">support@onlyfur.com</a> for assistance.</p>
    <div><strong>Tags:</strong> help, login, troubleshooting, issues</div>
  </div>
);

export default LoginTroubleshooting;
