import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MessageInterface from '@/components/messaging/MessageInterface';
import { Navigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MessageInterface />;
};

export default Messages;
