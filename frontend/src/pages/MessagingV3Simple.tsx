import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const MessagingV3Simple: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Messages V3 - Simple Version</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Page Loaded Successfully!</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">💬 Messaging Features</h2>
          <p className="text-gray-700">
            This is a simplified version of the MessagingV3 component to test if the route is working correctly.
            If you can see this page, the authentication and routing are working properly.
          </p>
          
          <div className="mt-4 space-y-2">
            <div className="bg-white p-4 rounded border">
              <p className="font-semibold">Test Message 1</p>
              <p className="text-sm text-gray-600">This is a test message to verify the page renders correctly.</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <p className="font-semibold">Test Message 2</p>
              <p className="text-sm text-gray-600">Another test message to ensure everything is working.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a href="/dashboard" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default MessagingV3Simple;
