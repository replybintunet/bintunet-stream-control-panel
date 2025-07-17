
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
    console.log('Loading streams from localStorage');
    const savedStreams = localStorage.getItem('bintunet_streams');
    if (savedStreams && user) {
      try {
        const allStreams = JSON.parse(savedStreams);
        const userStreams = allStreams.filter((s: Stream) => s.userId === user.id);
        console.log('Loaded streams:', userStreams.length);
        setStreams(userStreams);
      } catch (error) {
        console.error('Error loading streams:', error);
        setStreams([]);
      }
    }
  }, [user]);

  // Save streams to localStorage whenever streams change
  useEffect(() => {
    if (user && streams.length >= 0) {
      console.log('Saving streams to localStorage:', streams.length);
      localStorage.setItem('bintunet_streams', JSON.stringify(streams));
    }
  }, [streams, user]);

  // Simulate real-time metrics updates for live streams
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams(prevStreams => 
        prevStreams.map(stream => {
          if (stream.status === 'live') {
            const updatedStream = {
              ...stream,
              ping: Math.floor(Math.random() * 50) + 20, // 20-70ms
              viewerCount: Math.max(0, stream.viewerCount + Math.floor(Math.random() * 21) - 10), // ±10
              droppedFrames: stream.droppedFrames + Math.floor(Math.random() * 3),
              uploadSpeed: Math.max(0, stream.uploadSpeed + (Math.random() - 0.5) * 2), // ±1 Mbps
            };
            console.log('Updated stream metrics for:', stream.id);
            return updatedStream;
          }
          return stream;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createStream = (streamData: Partial<Stream>): boolean => {
    if (!user) {
      console.log('Cannot create stream: no user');
      return false;
    }
    
    const activeStreamCount = streams.filter(s => s.status === 'live' || s.status === 'starting').length;
    if (activeStreamCount >= user.maxStreams) {
      console.log('Cannot create stream: max streams reached');
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

    console.log('Creating new stream:', newStream.id);
    setStreams(prev => [...prev, newStream]);
    return true;
  };

  const updateStream = (id: string, updates: Partial<Stream>) => {
    console.log('Updating stream:', id, updates);
    setStreams(prev => 
      prev.map(stream => 
        stream.id === id ? { ...stream, ...updates } : stream
      )
    );
  };

  const deleteStream = (id: string) => {
    console.log('Deleting stream:', id);
    setStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const startStream = (id: string): boolean => {
    const stream = streams.find(s => s.id === id);
    if (!stream || !user) {
      console.log('Cannot start stream: stream not found or no user');
      return false;
    }

    const activeStreamCount = streams.filter(s => s.status === 'live' || s.status === 'starting').length;
    if (activeStreamCount >= user.maxStreams) {
      console.log('Cannot start stream: max streams reached');
      return false;
    }

    console.log('Starting stream:', id);
    updateStream(id, { 
      status: 'starting',
      startTime: new Date(),
      ping: Math.floor(Math.random() * 30) + 20,
      viewerCount: Math.floor(Math.random() * 5),
      uploadSpeed: Math.random() * 3 + 2,
      droppedFrames: 0,
    });

    // Simulate stream starting process
    setTimeout(() => {
      console.log('Stream started:', id);
      updateStream(id, { status: 'live' });
    }, 3000);

    return true;
  };

  const stopStream = (id: string) => {
    console.log('Stopping stream:', id);
    updateStream(id, { 
      status: 'stopping'
    });

    setTimeout(() => {
      console.log('Stream stopped:', id);
      updateStream(id, { 
        status: 'offline',
        startTime: undefined,
        ping: 0,
        viewerCount: 0,
        uploadSpeed: 0,
        droppedFrames: 0,
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
