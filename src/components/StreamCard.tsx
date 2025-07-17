
import React from 'react';
import { Stream } from '../types';
import { useStreams } from '../contexts/StreamContext';
import { Play, Square, Trash2, Edit, Activity, Users, Wifi, Clock, Upload, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface StreamCardProps {
  stream: Stream;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const { startStream, stopStream, deleteStream, getStreamMetrics } = useStreams();
  
  const metrics = getStreamMetrics(stream.id);
  
  const handleStart = () => {
    console.log('Starting stream:', stream.id);
    const success = startStream(stream.id);
    if (!success) {
      toast({
        title: "Cannot Start Stream",
        description: "Maximum concurrent streams reached (2 streams max)",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Stream Starting",
        description: `${stream.title} is initializing...`,
      });
    }
  };

  const handleStop = () => {
    console.log('Stopping stream:', stream.id);
    stopStream(stream.id);
    toast({
      title: "Stream Stopping",
      description: `${stream.title} is shutting down...`,
    });
  };

  const handleDelete = () => {
    if (stream.status === 'live' || stream.status === 'starting') {
      toast({
        title: "Cannot Delete",
        description: "Stop the stream before deleting",
        variant: "destructive",
      });
      return;
    }
    console.log('Deleting stream:', stream.id);
    deleteStream(stream.id);
    toast({
      title: "Stream Deleted",
      description: `${stream.title} has been removed`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500 hover:bg-green-600';
      case 'starting': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'stopping': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'starting': return 'STARTING';
      case 'stopping': return 'STOPPING';
      default: return 'OFFLINE';
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-gray-900 text-xl font-semibold truncate mb-3">
              {stream.title}
            </CardTitle>
            <div className="flex items-center flex-wrap gap-2">
              <Badge className={`${getStatusColor(stream.status)} text-white border-0 px-3 py-1 font-medium`}>
                {getStatusText(stream.status)}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white px-3 py-1">
                {stream.quality}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white px-3 py-1">
                {stream.mode}
              </Badge>
              {stream.isLooping && (
                <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 px-3 py-1">
                  Loop
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 hover:bg-white/50 rounded-lg"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={stream.status === 'live' || stream.status === 'starting'}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Stream Key */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">YouTube Stream Key</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm text-gray-800 truncate">
            {stream.youtubeKey || 'Not configured'}
          </div>
        </div>

        {/* Live Metrics */}
        {(stream.status === 'live' || stream.status === 'starting') && metrics && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <Eye className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-900">Live Metrics</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Wifi className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-gray-600">PING</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.ping}ms</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-xs font-medium text-gray-600">VIEWERS</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.viewerCount.toLocaleString()}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Upload className="h-4 w-4 text-yellow-600 mr-1" />
                  <span className="text-xs font-medium text-gray-600">UPLOAD</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.uploadSpeed.toFixed(1)} Mbps</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-xs font-medium text-gray-600">DURATION</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.duration}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dropped Frames Warning */}
        {stream.status === 'live' && metrics && metrics.droppedFrames > 10 && (
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Connection Issues Detected</p>
              <p className="text-xs text-red-700">{metrics.droppedFrames} frames dropped - Check network connection</p>
            </div>
          </div>
        )}

        {/* File Info */}
        {stream.fileName && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Video File</p>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border truncate">{stream.fileName}</p>
          </div>
        )}

        {/* Overlay Text */}
        {stream.overlayText && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Overlay Text</p>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border">{stream.overlayText}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {stream.status === 'offline' && (
              <Button
                onClick={handleStart}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Stream
              </Button>
            )}
            
            {(stream.status === 'live' || stream.status === 'starting') && (
              <Button
                onClick={handleStop}
                size="sm"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Stream
              </Button>
            )}

            {stream.status === 'stopping' && (
              <Button size="sm" disabled className="bg-gray-400 rounded-lg px-4 py-2">
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Stopping...
              </Button>
            )}
          </div>
          
          {stream.status === 'live' && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">Broadcasting Live</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
