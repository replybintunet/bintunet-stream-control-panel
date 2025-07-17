
import React from 'react';
import { Stream } from '../types';
import { useStreams } from '../contexts/StreamContext';
import { Play, Square, Trash2, Edit, Activity, Users, Wifi, Clock, Upload, AlertTriangle } from 'lucide-react';
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
    <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-gray-900 text-lg truncate">{stream.title}</CardTitle>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className={`${getStatusColor(stream.status)} text-white border-0`}>
                {getStatusText(stream.status)}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">
                {stream.quality}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">
                {stream.mode}
              </Badge>
              {stream.isLooping && (
                <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
                  Loop
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={stream.status === 'live' || stream.status === 'starting'}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stream Key */}
        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">YouTube Stream Key</p>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-2 font-mono text-sm text-gray-800 truncate">
            {stream.youtubeKey || 'Not configured'}
          </div>
        </div>

        {/* Metrics Grid */}
        {(stream.status === 'live' || stream.status === 'starting') && metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Wifi className="h-3 w-3 text-green-600" />
                <span className="text-xs text-gray-600">Ping</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{metrics.ping}ms</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-gray-600">Viewers</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{metrics.viewerCount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Upload className="h-3 w-3 text-yellow-600" />
                <span className="text-xs text-gray-600">Upload</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{metrics.uploadSpeed.toFixed(1)} Mbps</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-red-600" />
                <span className="text-xs text-gray-600">Duration</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{metrics.duration}</p>
            </div>
          </div>
        )}

        {/* Dropped Frames Warning */}
        {stream.status === 'live' && metrics && metrics.droppedFrames > 10 && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">
              {metrics.droppedFrames} frames dropped - Check network connection
            </span>
          </div>
        )}

        {/* File Info */}
        {stream.fileName && (
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">Video File</p>
            <p className="text-sm text-gray-800 truncate bg-gray-50 p-2 rounded border">{stream.fileName}</p>
          </div>
        )}

        {/* Overlay Text */}
        {stream.overlayText && (
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">Overlay Text</p>
            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded border">{stream.overlayText}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {stream.status === 'offline' && (
              <Button
                onClick={handleStart}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
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
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Stream
              </Button>
            )}

            {stream.status === 'stopping' && (
              <Button size="sm" disabled className="bg-gray-400">
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Stopping...
              </Button>
            )}
          </div>
          
          {stream.status === 'live' && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Broadcasting
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
