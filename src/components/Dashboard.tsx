
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

  console.log('Dashboard rendered with streams:', streams.length);
  console.log('Active streams:', activeStreams.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active Streams</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {activeStreams.length}
                <span className="text-sm text-gray-500 ml-1">/ {user.maxStreams}</span>
              </div>
              <p className="text-xs text-gray-600">
                {user.maxStreams - activeStreams.length} slots available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Viewers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalViewers.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Across all streams</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avg Upload Speed</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{avgUploadSpeed.toFixed(1)} Mbps</div>
              <p className="text-xs text-gray-600">Network performance</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Subscription</CardTitle>
              <Badge 
                variant={user.subscriptionStatus === 'premium' ? 'default' : 'secondary'}
                className={user.subscriptionStatus === 'premium' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 text-gray-800'}
              >
                {user.subscriptionStatus}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{user.credits}</div>
              <p className="text-xs text-gray-600">Credits remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streams Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Live Streams</h2>
                <p className="text-gray-600">Manage your active streaming sessions</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={activeStreams.length >= user.maxStreams}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Stream
              </Button>
            </div>

            {streams.length === 0 ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Streams Yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Create your first stream to start broadcasting to YouTube
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common streaming tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowCreateModal(true)}
                  disabled={activeStreams.length >= user.maxStreams}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Stream
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
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
