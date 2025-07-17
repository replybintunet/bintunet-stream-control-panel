
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="text-slate-400">Loading BintuNet Live Panel...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
};

export default Index;
