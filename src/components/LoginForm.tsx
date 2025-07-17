
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Key, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !accessCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password, accessCode);
    
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or access code",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to BintuNet!",
        description: "Successfully logged in",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mb-4">
            <span className="text-2xl font-bold text-white">BN</span>
          </div>
          <h1 className="text-3xl font-bold text-white">BintuNet Live</h1>
          <p className="text-slate-400">Professional Streaming Control Panel</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your credentials to access your streaming dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email or Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="demo@bintunet.com or demo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode" className="text-slate-200">Access Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="DEMO123"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Demo Account: <span className="text-purple-400">demo@bintunet.com</span> / 
                <span className="text-purple-400"> password</span> / 
                <span className="text-purple-400"> DEMO123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
