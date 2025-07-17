
import React, { useState } from 'react';
import { useStreams } from '../contexts/StreamContext';
import { X, Upload, Monitor, Smartphone, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStreamModal: React.FC<CreateStreamModalProps> = ({ isOpen, onClose }) => {
  const { createStream } = useStreams();
  const [formData, setFormData] = useState({
    title: '',
    youtubeKey: '',
    quality: '720p' as '1080p' | '720p' | '480p',
    mode: 'desktop' as 'desktop' | 'mobile',
    isLooping: false,
    maxDuration: '',
    fileName: '',
    overlayText: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.youtubeKey) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and YouTube stream key",
        variant: "destructive",
      });
      return;
    }

    const success = createStream({
      ...formData,
      maxDuration: formData.maxDuration ? parseInt(formData.maxDuration) : undefined,
    });

    if (success) {
      toast({
        title: "Stream Created",
        description: `${formData.title} is ready to start`,
      });
      onClose();
      resetForm();
    } else {
      toast({
        title: "Cannot Create Stream",
        description: "Maximum concurrent streams reached",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      youtubeKey: '',
      quality: '720p',
      mode: 'desktop',
      isLooping: false,
      maxDuration: '',
      fileName: '',
      overlayText: '',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
      toast({
        title: "File Selected",
        description: `${file.name} ready for streaming`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Settings2 className="h-5 w-5" />
            <span>Create New Stream</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="basic" className="text-slate-200">Basic</TabsTrigger>
              <TabsTrigger value="video" className="text-slate-200">Video</TabsTrigger>
              <TabsTrigger value="advanced" className="text-slate-200">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">Stream Title *</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Stream"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeKey" className="text-slate-200">YouTube Stream Key *</Label>
                <Input
                  id="youtubeKey"
                  type="password"
                  placeholder="xxxx-xxxx-xxxx-xxxx-xxxx"
                  value={formData.youtubeKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeKey: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <p className="text-xs text-slate-400">
                  Get this from YouTube Studio → Go Live → Stream Key
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Quality</Label>
                  <Select 
                    value={formData.quality} 
                    onValueChange={(value: '1080p' | '720p' | '480p') => 
                      setFormData(prev => ({ ...prev, quality: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="1080p" className="text-white">1080p (Full HD)</SelectItem>
                      <SelectItem value="720p" className="text-white">720p (HD)</SelectItem>
                      <SelectItem value="480p" className="text-white">480p (SD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Orientation</Label>
                  <Select 
                    value={formData.mode} 
                    onValueChange={(value: 'desktop' | 'mobile') => 
                      setFormData(prev => ({ ...prev, mode: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="desktop" className="text-white">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>Desktop (16:9)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile" className="text-white">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <span>Mobile (9:16)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Video File</CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload a video file to stream (temporary storage)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-slate-300">Choose a video file to stream</p>
                        <p className="text-xs text-slate-500">MP4, MOV, AVI supported</p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('video-upload')?.click()}
                          className="border-slate-600 text-slate-200 hover:bg-slate-600"
                        >
                          Select Video File
                        </Button>
                      </div>
                    </div>
                    
                    {formData.fileName && (
                      <div className="bg-slate-600/30 rounded-md p-3">
                        <p className="text-sm text-slate-300">Selected: {formData.fileName}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="overlayText" className="text-slate-200">Overlay Text (Optional)</Label>
                <Textarea
                  id="overlayText"
                  placeholder="Add custom text overlay to your stream..."
                  value={formData.overlayText}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayText: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 min-h-20"
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-200 text-base">Loop Video</Label>
                  <p className="text-sm text-slate-400">Automatically restart when video ends</p>
                </div>
                <Switch
                  checked={formData.isLooping}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLooping: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDuration" className="text-slate-200">Max Duration (Hours)</Label>
                <Input
                  id="maxDuration"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDuration: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <p className="text-xs text-slate-400">
                  Stream will automatically stop after this duration
                </p>
              </div>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Stream Settings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-white">{formData.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="text-white">{formData.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Loop:</span>
                    <span className="text-white">{formData.isLooping ? 'Yes' : 'No'}</span>
                  </div>
                  {formData.maxDuration && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white">{formData.maxDuration}h</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              Create Stream
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
