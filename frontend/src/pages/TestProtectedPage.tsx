import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestProtectedPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Protected Route Test</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Authentication Status</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Is Authenticated:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <strong>Is Loading:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                {isLoading ? 'Yes' : 'No'}
              </span>
            </div>
            {user && (
              <>
                <div><strong>User Email:</strong> {user.email}</div>
                <div><strong>User Role:</strong> {user.role}</div>
                <div><strong>Display Name:</strong> {user.displayName}</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🔧 Debug Information</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Token in localStorage:</strong> {localStorage.getItem('onlyfur_auth_token') ? 'Present' : 'Missing'}</div>
            <div><strong>User in localStorage:</strong> {localStorage.getItem('onlyfur_user_data') ? 'Present' : 'Missing'}</div>
            <div><strong>Remember Me:</strong> {localStorage.getItem('onlyfur_remember_me') ? 'True' : 'False'}</div>
            <div><strong>Current Time:</strong> {new Date().toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 Navigation Test</h2>
          <div className="space-y-2">
            <a href="/dashboard" className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Go to Dashboard
            </a>
            <a href="/messages" className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Go to Messages (Original)
            </a>
            <a href="/messages-v3" className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Go to Messages V3
            </a>
            <a href="/profile" className="block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProtectedPage;
