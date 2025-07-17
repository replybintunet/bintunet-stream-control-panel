
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStreams } from '../contexts/StreamContext';
import { LogOut, User, Settings, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { streams } = useStreams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const activeStreams = streams.filter(s => s.status === 'live' || s.status === 'starting').length;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <span className="text-lg font-bold text-white">BN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">BintuNet Live</h1>
              <p className="text-xs text-slate-400">Professional Streaming Panel</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant={activeStreams > 0 ? 'default' : 'secondary'} className="bg-green-500">
                {activeStreams} Live
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {user.subscriptionStatus}
              </Badge>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <AvatarFallback className="bg-transparent text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
                <DropdownMenuLabel className="text-slate-200">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-slate-700 hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-500">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={activeStreams > 0 ? 'default' : 'secondary'} className="bg-green-500">
                    {activeStreams} Live
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {user.subscriptionStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 px-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-200 hover:bg-slate-700"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-200 hover:bg-slate-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="w-full justify-start text-red-400 hover:bg-slate-700 hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
