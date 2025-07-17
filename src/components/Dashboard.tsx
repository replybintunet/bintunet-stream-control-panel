
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStreams } from '../contexts/StreamContext';
import { StreamCard } from './StreamCard';
import { CreateStreamModal } from './CreateStreamModal';
import { Header } from './Header';
import { PaymentSection } from './PaymentSection';
import { Plus, Activity, Users, Zap, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.username}
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your live streams and monitor performance
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Badge 
                variant={user.subscriptionStatus === 'premium' ? 'default' : 'secondary'}
                className={`px-4 py-2 text-sm font-medium ${user.subscriptionStatus === 'premium' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
              >
                {user.subscriptionStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Active Streams
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {activeStreams.length}
                <span className="text-lg text-gray-500 ml-1">/ {user.maxStreams}</span>
              </div>
              <p className="text-sm text-gray-600">
                {user.maxStreams - activeStreams.length} slots available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Viewers
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {totalViewers.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Across all streams</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Upload Speed
              </CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {avgUploadSpeed.toFixed(1)}
                <span className="text-lg text-gray-500 ml-1">Mbps</span>
              </div>
              <p className="text-sm text-gray-600">Average performance</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Credits
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {user.credits}
              </div>
              <p className="text-sm text-gray-600">Credits remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Streams Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Live Streaming</h2>
                <p className="text-gray-600">Manage your active streaming sessions</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={activeStreams.length >= user.maxStreams}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-6 py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Stream
              </Button>
            </div>

            {streams.length === 0 ? (
              <Card className="bg-white border-0 shadow-lg rounded-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-6">
                    <Activity className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Streams</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    Create your first stream to start broadcasting to YouTube and reach your audience
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-8 py-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Stream
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
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
            <Card className="bg-white border-0 shadow-lg rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 font-semibold">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Streamline your workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-lg py-3"
                  onClick={() => setShowCreateModal(true)}
                  disabled={activeStreams.length >= user.maxStreams}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Create New Stream
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-lg py-3"
                  onClick={() => window.open('https://studio.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw/livestreaming', '_blank')}
                >
                  <Activity className="h-4 w-4 mr-3" />
                  YouTube Studio
                </Button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-red-900 font-semibold">Performance</CardTitle>
                <CardDescription className="text-red-700">
                  Your streaming insights
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-800">Stream Quality</span>
                    <Badge className="bg-red-200 text-red-800 border-red-300">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-800">Network Status</span>
                    <Badge className="bg-green-200 text-green-800 border-green-300">Stable</Badge>
                  </div>
                </div>
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
