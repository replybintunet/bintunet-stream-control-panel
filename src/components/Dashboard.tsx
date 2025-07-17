
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStreams } from '../contexts/StreamContext';
import { StreamCard } from './StreamCard';
import { CreateStreamModal } from './CreateStreamModal';
import { Header } from './Header';
import { PaymentSection } from './PaymentSection';
import { Plus, Activity, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { streams } = useStreams();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user) return null;

  const activeStreams = streams.filter(s => s.status === 'live' || s.status === 'starting');
  const totalViewers = streams.reduce((sum, s) => sum + s.viewerCount, 0);
  const avgUploadSpeed = streams.length > 0 
    ? streams.reduce((sum, s) => sum + s.uploadSpeed, 0) / streams.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Streams</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activeStreams.length}
                <span className="text-sm text-slate-400 ml-1">/ {user.maxStreams}</span>
              </div>
              <p className="text-xs text-slate-400">
                {user.maxStreams - activeStreams.length} slots available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Viewers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalViewers.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Across all streams</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Avg Upload Speed</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgUploadSpeed.toFixed(1)} Mbps</div>
              <p className="text-xs text-slate-400">Network performance</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Subscription</CardTitle>
              <Badge 
                variant={user.subscriptionStatus === 'premium' ? 'default' : 'secondary'}
                className={user.subscriptionStatus === 'premium' ? 'bg-purple-500' : ''}
              >
                {user.subscriptionStatus}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{user.credits}</div>
              <p className="text-xs text-slate-400">Credits remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streams Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Live Streams</h2>
                <p className="text-slate-400">Manage your active streaming sessions</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={activeStreams.length >= user.maxStreams}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Stream
              </Button>
            </div>

            {streams.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Streams Yet</h3>
                  <p className="text-slate-400 text-center mb-4">
                    Create your first stream to start broadcasting to YouTube
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Stream
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {streams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PaymentSection />
            
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">
                  Common streaming tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700"
                  onClick={() => setShowCreateModal(true)}
                  disabled={activeStreams.length >= user.maxStreams}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Stream
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700"
                  onClick={() => window.open('https://studio.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw/livestreaming', '_blank')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  YouTube Studio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CreateStreamModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};
