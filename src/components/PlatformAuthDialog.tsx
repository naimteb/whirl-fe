
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  MessageSquare
} from "lucide-react";

interface PlatformAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  platform: {
    id: string;
    name: string;
    icon: any;
    color: string;
  } | null;
  onConnect: (credentials: { email: string; password: string }) => void;
}

const PlatformAuthDialog = ({ isOpen, onClose, platform, onConnect }: PlatformAuthDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!email || !password) return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      onConnect({ email, password });
      setIsConnecting(false);
      setEmail('');
      setPassword('');
      onClose();
    }, 2000);
  };

  if (!platform) return null;

  const IconComponent = platform.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            Connect to {platform.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={!email || !password || isConnecting}
              className="flex-1"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Your credentials are securely encrypted and stored.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformAuthDialog;
