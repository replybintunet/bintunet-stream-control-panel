
import React from 'react';
import { Stream } from '../types';
import { useStreams } from '../contexts/StreamContext';
import { Play, Square, Trash2, Edit, Activity, Users, Wifi, Clock, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface StreamCardProps {
  stream: Stream;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const { startStream, stopStream, deleteStream, getStreamMetrics } = useStreams();
  
  const metrics = getStreamMetrics(stream.id);
  
  const handleStart = () => {
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
    deleteStream(stream.id);
    toast({
      title: "Stream Deleted",
      description: `${stream.title} has been removed`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      default: return 'bg-gray-500';
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
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg truncate">{stream.title}</CardTitle>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className={`${getStatusColor(stream.status)} text-white border-0`}>
                {getStatusText(stream.status)}
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {stream.quality}
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {stream.mode}
              </Badge>
              {stream.isLooping && (
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  Loop
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={stream.status === 'live' || stream.status === 'starting'}
              className="text-slate-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stream Key */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400">YouTube Stream Key</p>
          <div className="bg-slate-900/50 rounded-md p-2 font-mono text-sm text-slate-300 truncate">
            {stream.youtubeKey || 'Not configured'}
          </div>
        </div>

        {/* Metrics Grid */}
        {(stream.status === 'live' || stream.status === 'starting') && metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-xs text-slate-400">Ping</span>
              </div>
              <p className="text-sm font-medium text-white">{metrics.ping}ms</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-slate-400">Viewers</span>
              </div>
              <p className="text-sm font-medium text-white">{metrics.viewerCount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Upload className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-400">Upload</span>
              </div>
              <p className="text-sm font-medium text-white">{metrics.uploadSpeed.toFixed(1)} Mbps</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-slate-400">Duration</span>
              </div>
              <p className="text-sm font-medium text-white">{metrics.duration}</p>
            </div>
          </div>
        )}

        {/* Dropped Frames Warning */}
        {stream.status === 'live' && metrics && metrics.droppedFrames > 10 && (
          <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-600/20 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-300">
              {metrics.droppedFrames} frames dropped - Check network connection
            </span>
          </div>
        )}

        {/* File Info */}
        {stream.fileName && (
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Video File</p>
            <p className="text-sm text-slate-300 truncate">{stream.fileName}</p>
          </div>
        )}

        {/* Overlay Text */}
        {stream.overlayText && (
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Overlay Text</p>
            <p className="text-sm text-slate-300">{stream.overlayText}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div className="flex items-center space-x-2">
            {stream.status === 'offline' && (
              <Button
                onClick={handleStart}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
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
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Stream
              </Button>
            )}

            {stream.status === 'stopping' && (
              <Button size="sm" disabled>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Stopping...
              </Button>
            )}
          </div>
          
          {stream.status === 'live' && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
              Broadcasting
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
