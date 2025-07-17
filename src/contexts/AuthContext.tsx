
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'demo@bintunet.com',
    username: 'demo',
    accessCode: 'DEMO123',
    password: 'password',
    subscriptionStatus: 'premium' as const,
    credits: 150
  },
  {
    id: '2',
    email: 'user@example.com',
    username: 'user1',
    accessCode: 'USER456',
    password: 'test123',
    subscriptionStatus: 'free' as const,
    credits: 10
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('bintunet_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, accessCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      (u.email === email || u.username === email) && 
      u.password === password && 
      u.accessCode === accessCode
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        accessCode: foundUser.accessCode,
        isLoggedIn: true,
        activeStreams: 0,
        maxStreams: 2,
        subscriptionStatus: foundUser.subscriptionStatus,
        credits: foundUser.credits
      };
      
      setUser(userData);
      localStorage.setItem('bintunet_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bintunet_user');
    localStorage.removeItem('bintunet_streams');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
