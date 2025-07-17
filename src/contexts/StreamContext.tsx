
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stream, StreamMetrics } from '../types';
import { useAuth } from './AuthContext';

interface StreamContextType {
  streams: Stream[];
  createStream: (streamData: Partial<Stream>) => boolean;
  updateStream: (id: string, updates: Partial<Stream>) => void;
  deleteStream: (id: string) => void;
  startStream: (id: string) => boolean;
  stopStream: (id: string) => void;
  getStreamMetrics: (id: string) => StreamMetrics | null;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const { user } = useAuth();

  // Load streams from localStorage on mount
  useEffect(() => {
    const savedStreams = localStorage.getItem('bintunet_streams');
    if (savedStreams && user) {
      const allStreams = JSON.parse(savedStreams);
      const userStreams = allStreams.filter((s: Stream) => s.userId === user.id);
      setStreams(userStreams);
    }
  }, [user]);

  // Save streams to localStorage whenever streams change
  useEffect(() => {
    if (user && streams.length > 0) {
      localStorage.setItem('bintunet_streams', JSON.stringify(streams));
    }
  }, [streams, user]);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams(prevStreams => 
        prevStreams.map(stream => {
          if (stream.status === 'live') {
            return {
              ...stream,
              ping: Math.floor(Math.random() * 50) + 20, // 20-70ms
              viewerCount: Math.max(0, stream.viewerCount + Math.floor(Math.random() * 21) - 10), // ±10
              droppedFrames: stream.droppedFrames + Math.floor(Math.random() * 3),
              uploadSpeed: Math.max(0, stream.uploadSpeed + (Math.random() - 0.5) * 2), // ±1 Mbps
            };
          }
          return stream;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createStream = (streamData: Partial<Stream>): boolean => {
    if (!user) return false;
    
    const activeStreamCount = streams.filter(s => s.status === 'live' || s.status === 'starting').length;
    if (activeStreamCount >= user.maxStreams) {
      return false;
    }

    const newStream: Stream = {
      id: `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      title: streamData.title || 'Untitled Stream',
      youtubeKey: streamData.youtubeKey || '',
      quality: streamData.quality || '720p',
      mode: streamData.mode || 'desktop',
      status: 'offline',
      isLooping: streamData.isLooping || false,
      maxDuration: streamData.maxDuration,
      ping: 0,
      viewerCount: 0,
      droppedFrames: 0,
      uploadSpeed: 0,
      fileName: streamData.fileName,
      overlayText: streamData.overlayText,
    };

    setStreams(prev => [...prev, newStream]);
    return true;
  };

  const updateStream = (id: string, updates: Partial<Stream>) => {
    setStreams(prev => 
      prev.map(stream => 
        stream.id === id ? { ...stream, ...updates } : stream
      )
    );
  };

  const deleteStream = (id: string) => {
    setStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const startStream = (id: string): boolean => {
    const stream = streams.find(s => s.id === id);
    if (!stream || !user) return false;

    const activeStreamCount = streams.filter(s => s.status === 'live' || s.status === 'starting').length;
    if (activeStreamCount >= user.maxStreams) {
      return false;
    }

    updateStream(id, { 
      status: 'starting',
      startTime: new Date(),
      ping: Math.floor(Math.random() * 30) + 20,
      viewerCount: Math.floor(Math.random() * 5),
      uploadSpeed: Math.random() * 3 + 2,
    });

    // Simulate stream starting process
    setTimeout(() => {
      updateStream(id, { status: 'live' });
    }, 3000);

    return true;
  };

  const stopStream = (id: string) => {
    updateStream(id, { 
      status: 'stopping'
    });

    setTimeout(() => {
      updateStream(id, { 
        status: 'offline',
        startTime: undefined,
        ping: 0,
        viewerCount: 0,
        uploadSpeed: 0,
      });
    }, 2000);
  };

  const getStreamMetrics = (id: string): StreamMetrics | null => {
    const stream = streams.find(s => s.id === id);
    if (!stream) return null;

    const duration = stream.startTime 
      ? formatDuration(Date.now() - stream.startTime.getTime())
      : '00:00:00';

    return {
      ping: stream.ping,
      viewerCount: stream.viewerCount,
      droppedFrames: stream.droppedFrames,
      uploadSpeed: stream.uploadSpeed,
      duration,
    };
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <StreamContext.Provider value={{
      streams,
      createStream,
      updateStream,
      deleteStream,
      startStream,
      stopStream,
      getStreamMetrics,
    }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStreams = () => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStreams must be used within a StreamProvider');
  }
  return context;
};
