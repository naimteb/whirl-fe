import { useState, type ComponentType } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  MessageSquare, 
  BarChart3, 
  Send,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Check,
  Edit,
  X,
  RefreshCw,
  ChevronDown,
  Loader2,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlatformAuthDialog from "@/components/PlatformAuthDialog";
import { useAuth } from "@/hooks/useAuth";

// API configuration
const API_BASE_URL = 'http://localhost:3001/api';

type PlatformItem = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string; size?: string | number }>;
  color: string;
};

type GeneratedContentItem = {
  platform: string;
  platformName: string;
  color: string;
  image: string;
  content: { caption: string; hashtags: string[] };
  approved: boolean;
  icon?: ComponentType<{ className?: string; size?: string | number }>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'system', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'linkedin']);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentItem[]>([]);
  const [authDialog, setAuthDialog] = useState<{isOpen: boolean, platform: PlatformItem | null}>({
    isOpen: false,
    platform: null
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const platforms: PlatformItem[] = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'twitter', name: 'X/Twitter', icon: Twitter, color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-500' },
    { id: 'threads', name: 'Threads', icon: MessageSquare, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube Shorts', icon: Youtube, color: 'bg-red-500' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    // If platform is not connected, show auth dialog
    if (!connectedPlatforms.includes(platformId)) {
      setAuthDialog({
        isOpen: true,
        platform: platform
      });
      return;
    }

    // If already connected, toggle selection
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const handlePlatformConnect = (credentials: { email: string; password: string }) => {
    if (authDialog.platform) {
      // Add to connected platforms
      setConnectedPlatforms(prev => [...prev, authDialog.platform.id]);
      // Also add to selected platforms
      setSelectedPlatforms(prev => [...prev, authDialog.platform.id]);
      console.log(`Connected to ${authDialog.platform.name} with:`, credentials);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || selectedPlatforms.length === 0) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageContent = currentMessage;
    setCurrentMessage('');

    // Show system is processing
    const thinkingMessage = {
      id: (Date.now() + 1).toString(),
      type: 'system' as const,
      content: "Processing your request and generating platform-specific content...",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, thinkingMessage]);

    setIsGenerating(true);

    try {
      // Call the backend API
      const response = await fetch(`${API_BASE_URL}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          message: messageContent,
          platforms: selectedPlatforms
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update system message with real response
        setChatMessages(prev => prev.map(msg => 
          msg.id === thinkingMessage.id 
            ? { ...msg, content: data.message }
            : msg
        ));

        // Set generated content from API
        setGeneratedContent(data.content.map((content: GeneratedContentItem) => ({
          ...content,
          icon: (platforms.find(p => p.id === content.platform)?.icon) || MessageSquare,
          color: content.color || 'bg-gray-500'
        })));
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Update system message with error
      setChatMessages(prev => prev.map(msg => 
        msg.id === thinkingMessage.id 
          ? { ...msg, content: "I'm sorry, I encountered an error while generating content. Please try again or check your API configuration." }
          : msg
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentAction = (index: number, action: 'approve' | 'edit' | 'cancel' | 'regenerate') => {
    const updatedContent = [...generatedContent];
    
    switch (action) {
      case 'approve':
        updatedContent[index].approved = true;
        break;
      case 'cancel':
        updatedContent.splice(index, 1);
        break;
      case 'regenerate':
        // For regeneration, we could call the API again
        // For now, just show a message
        console.log('Regeneration requested for:', updatedContent[index].platform);
        break;
    }
    
    setGeneratedContent(updatedContent);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: true, path: '/dashboard' },
    { id: 'brand-setup', label: 'Brand Setup', icon: User, active: false, path: '/brand-setup' },
    { id: 'content', label: 'Content Library', icon: MessageSquare, active: false, path: '/content' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Whirl</span>
            </div>
          </div>
          
          <nav className="px-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                } ${(item.path !== '/dashboard' && item.path !== '/brand-setup') ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={item.path !== '/dashboard' && item.path !== '/brand-setup'}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            )}
          </nav>
        </div>

        {/* Main Content - Content Creation */}
        <div className="flex-1 p-6 flex flex-col max-h-screen overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Creation</h1>
            <p className="text-gray-600">Describe your content idea and I'll create platform-specific posts</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 border rounded-lg p-4 bg-white mb-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation to create content</p>
                    <p className="text-sm mt-2">Try: "Create a post about our new product launch"</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Input Area with Platform Selector */}
            <div className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Describe the content you want to create..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={isGenerating}
              />
              
              {/* Platform Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]" disabled={isGenerating}>
                    <span className="text-sm">{selectedPlatforms.length} platforms</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
                  {platforms.map((platform) => {
                    const isConnected = connectedPlatforms.includes(platform.id);
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <DropdownMenuItem 
                        key={platform.id} 
                        onClick={() => handlePlatformToggle(platform.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <platform.icon className="h-4 w-4" />
                            <span>{platform.name}</span>
                            {isConnected && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          {isSelected && isConnected && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || selectedPlatforms.length === 0 || isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Generated Content Preview - Redesigned */}
          {generatedContent.length > 0 && (
            <div className="mt-6 flex-1 min-h-0">
              <Separator className="mb-6" />
              <h3 className="text-lg font-semibold mb-4">Generated Content</h3>
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                  {generatedContent.map((content, index) => (
                    <Card key={index} className="border-2 border-gray-200 flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 ${content.color} rounded-lg flex items-center justify-center`}>
                              <content.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{content.platformName}</span>
                            {content.approved && (
                              <Badge className="bg-green-100 text-green-800">Approved</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={content.image} 
                              alt="Generated content" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-sm text-gray-700 flex-1">
                            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{content.content.caption}</pre>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {content.content.hashtags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-4 mt-4 border-t">
                          <Button
                            size="sm"
                            variant={content.approved ? "default" : "outline"}
                            onClick={() => handleContentAction(index, 'approve')}
                            className="flex-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {content.approved ? 'Approved' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContentAction(index, 'edit')}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContentAction(index, 'regenerate')}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContentAction(index, 'cancel')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Save / Load controls */}
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (!user?.id) return;
                try {
                  const payload = generatedContent.map(({ icon, ...rest }) => rest);
                  const resp = await fetch(`${API_BASE_URL}/content/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id, content: payload }),
                  });
                  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                } catch (e) {
                  console.error('Save failed', e);
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!user?.id) return;
                try {
                  const resp = await fetch(`${API_BASE_URL}/content/${user.id}`);
                  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                  const data = await resp.json();
                  if (data.success && Array.isArray(data.content)) {
                    setGeneratedContent(
                      data.content.map((c: GeneratedContentItem) => ({
                        ...c,
                        icon: (platforms.find(p => p.id === c.platform)?.icon) || MessageSquare,
                        color: c.color || 'bg-gray-500',
                      }))
                    );
                  }
                } catch (e) {
                  console.error('Load failed', e);
                }
              }}
            >
              Load
            </Button>
          </div>
        </div>
      </div>

      {/* Platform Authentication Dialog */}
      <PlatformAuthDialog
        isOpen={authDialog.isOpen}
        onClose={() => setAuthDialog({ isOpen: false, platform: null })}
        platform={authDialog.platform}
        onConnect={handlePlatformConnect}
      />
    </>
  );
};

export default Dashboard;
