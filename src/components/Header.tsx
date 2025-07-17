
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStreams } from '../contexts/StreamContext';
import { LogOut, User, Settings, Bell, Menu, X, Zap } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">BintuNet Live</h1>
              <p className="text-xs text-gray-500 -mt-1">Professional Streaming Panel</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Status Badges */}
            <div className="flex items-center space-x-3">
              <Badge 
                variant={activeStreams > 0 ? 'default' : 'secondary'} 
                className={`px-3 py-1 font-medium ${activeStreams > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${activeStreams > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {activeStreams} Live
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50 px-3 py-1 font-medium">
                {user.subscriptionStatus}
              </Badge>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                    <AvatarFallback className="bg-transparent text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-gray-200 shadow-xl rounded-lg" align="end">
                <DropdownMenuLabel className="text-gray-900">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 rounded-md">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 rounded-md">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 rounded-md"
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
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={activeStreams > 0 ? 'default' : 'secondary'}
                    className={`px-3 py-1 font-medium ${activeStreams > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${activeStreams > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    {activeStreams} Live
                  </Badge>
                  <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50 px-3 py-1 font-medium">
                    {user.subscriptionStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 px-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:bg-red-50 rounded-lg"
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
