
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { 
  User, 
  Palette, 
  Settings, 
  Sparkles,
  Target,
  DollarSign,
  FileText,
  TrendingUp,
  Building,
} from "lucide-react";
import { BrandPreferencesService } from "@/lib/brandPreferencesService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const BrandSetup = () => {
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [marketingStrategy, setMarketingStrategy] = useState('');
  const [salesScale, setSalesScale] = useState([3]);
  const [awarenessScale, setAwarenessScale] = useState([3]);
  const [engagementScale, setEngagementScale] = useState([3]);
  const [leadGenScale, setLeadGenScale] = useState([3]);
  const [brandRecognitionScale, setBrandRecognitionScale] = useState([3]);
  const { user, setCurrentUser } = useAuth();
  const { toast } = useToast();
  const effectiveUserId = (() => {
    const ctxId = user?.id;
    if (ctxId) return ctxId;
    try {
      const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (stored?.id) return stored.id;
      const users = JSON.parse(localStorage.getItem('users') || 'null');
      if (Array.isArray(users) && users.length && users[0]?.id) return users[0].id;
      return null;
    } catch {
      return null;
    }
  })();

  // Ensure auth context is hydrated from localStorage on this page
  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
          }
        }
      } catch {
        // no-op
      }
    }
  }, [user, setCurrentUser]);

  const handleLoad = async () => {
    const userId = effectiveUserId;
    if (!userId) {
      toast({ title: 'Not signed in', description: 'Please sign in to load preferences.' });
      return;
    }
    const prefs = await BrandPreferencesService.getPreferencesByUserId(userId);
    if (!prefs) {
      toast({ title: 'No saved preferences', description: 'Nothing to load yet.' });
      return;
    }
    setMarketingStrategy(prefs.marketing_strategy ?? '');
    setSelectedTones(prefs.tone_of_voice ?? []);
    if (prefs.sales_importance) setSalesScale([prefs.sales_importance]);
    if (prefs.brand_awareness_importance) setAwarenessScale([prefs.brand_awareness_importance]);
    if (prefs.customer_engagement_importance) setEngagementScale([prefs.customer_engagement_importance]);
    if (prefs.lead_generation_importance) setLeadGenScale([prefs.lead_generation_importance]);
    if (prefs.brand_recognition_importance) setBrandRecognitionScale([prefs.brand_recognition_importance]);
    toast({ title: 'Loaded', description: 'Preferences loaded successfully.' });
  };

  const handleSave = async () => {
    const userId = effectiveUserId;
    if (!userId) {
      toast({ title: 'Not signed in', description: 'Please sign in to save preferences.' });
      return;
    }
    try {
      await BrandPreferencesService.savePreferences({
        user_id: userId,
        marketing_strategy: marketingStrategy || undefined,
        tone_of_voice: selectedTones,
        sales_importance: salesScale[0],
        brand_awareness_importance: awarenessScale[0],
        customer_engagement_importance: engagementScale[0],
        lead_generation_importance: leadGenScale[0],
        brand_recognition_importance: brandRecognitionScale[0],
      });
      toast({ title: 'Saved', description: 'Preferences saved successfully.' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast({ title: 'Save failed', description: message || 'Could not save preferences.' });
    }
  };

  const toneOptions = [
    'Professional', 'Friendly', 'Playful', 'Luxurious', 'Bold', 
    'Authoritative', 'Quirky', 'Inspirational', 'Witty', 'Calm'
  ];

  const handleToneChange = (tone: string, checked: boolean) => {
    if (checked) {
      setSelectedTones([...selectedTones, tone]);
    } else {
      setSelectedTones(selectedTones.filter(t => t !== tone));
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings, active: false },
    { id: 'brand-setup', label: 'Brand Setup', icon: User, active: true },
    { id: 'content', label: 'Content Library', icon: Settings, active: false },
    { id: 'analytics', label: 'Analytics', icon: Settings, active: false },
    { id: 'billing', label: 'Billing', icon: Settings, active: false },
  ];

  return (
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                item.active 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="sticky top-0 z-10 bg-gray-50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-gray-900">Brand Setup</h1>
              <p className="text-gray-600">Configure your brand voice and preferences to get better content</p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleLoad}>Load changes</Button>
              <Button variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleSave}>Save Brand Settings</Button>  
            </div>
          </div>
        </div>
        <ScrollArea className="h-full">
          <div className="space-y-8 pr-4 max-w-4xl">
            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age-range">Age Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55-64">55-64</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., United States, Europe, Global" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="product-description">Description of Products/Services</Label>
                  <Textarea 
                    id="product-description" 
                    placeholder="Describe your products or services in detail..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Marketing Strategy & Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Marketing Strategy & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Marketing Strategy</Label>
                    <Select value={marketingStrategy} onValueChange={setMarketingStrategy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital">Digital Marketing</SelectItem>
                        <SelectItem value="general">General Marketing</SelectItem>
                        <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Main Budget (Optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1k">Under $1,000</SelectItem>
                        <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Voice & Culture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Brand Voice & Culture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Tone of Voice</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {toneOptions.map((tone) => (
                      <div key={tone} className="flex items-center space-x-2">
                        <Checkbox
                          id={tone}
                          checked={selectedTones.includes(tone)}
                          onCheckedChange={(checked) => handleToneChange(tone, checked as boolean)}
                        />
                        <Label htmlFor={tone} className="text-sm">{tone}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="company-culture">Culture of the Company</Label>
                  <Textarea 
                    id="company-culture"
                    placeholder="Describe your company culture, values, and what makes your organization unique..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="past-ads">Past Ads (If Available)</Label>
                  <Textarea 
                    id="past-ads"
                    placeholder="Describe or paste examples of your past successful advertisements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Marketing Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Marketing Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Rate Importance (1-5 Scale)</Label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Sales</Label>
                        <span className="text-sm text-gray-500">{salesScale[0]}</span>
                      </div>
                      <Slider 
                        value={salesScale} 
                        onValueChange={setSalesScale}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Brand Awareness</Label>
                        <span className="text-sm text-gray-500">{awarenessScale[0]}</span>
                      </div>
                      <Slider 
                        value={awarenessScale} 
                        onValueChange={setAwarenessScale}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Customer Engagement</Label>
                        <span className="text-sm text-gray-500">{engagementScale[0]}</span>
                      </div>
                      <Slider 
                        value={engagementScale} 
                        onValueChange={setEngagementScale}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Lead Generation</Label>
                        <span className="text-sm text-gray-500">{leadGenScale[0]}</span>
                      </div>
                      <Slider 
                        value={leadGenScale} 
                        onValueChange={setLeadGenScale}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Brand Recognition</Label>
                        <span className="text-sm text-gray-500">{brandRecognitionScale[0]}</span>
                      </div>
                      <Slider 
                        value={brandRecognitionScale} 
                        onValueChange={setBrandRecognitionScale}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-3 block">Quick Questions (Yes/No)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Do you currently have an active social media presence?</span>
                      <RadioGroup className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="social-yes" />
                          <Label htmlFor="social-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="social-no" />
                          <Label htmlFor="social-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Are you targeting B2B customers?</span>
                      <RadioGroup className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="b2b-yes" />
                          <Label htmlFor="b2b-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="b2b-no" />
                          <Label htmlFor="b2b-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Do you have seasonal marketing needs?</span>
                      <RadioGroup className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="seasonal-yes" />
                          <Label htmlFor="seasonal-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="seasonal-no" />
                          <Label htmlFor="seasonal-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Logo Upload</Label>
                  <Input id="logo-upload" type="file" accept="image/*" />
                  <p className="text-sm text-gray-500 mt-1">Upload your brand logo (PNG, JPG, SVG)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded border"></div>
                      <Input placeholder="#3B82F6" />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500 rounded border"></div>
                      <Input placeholder="#8B5CF6" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="color-palette">Additional Color Palette</Label>
                  <Textarea 
                    id="color-palette"
                    placeholder="List additional brand colors with hex codes..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="inspiration">Brand Inspiration</Label>
                  <Textarea 
                    id="inspiration"
                    placeholder="Describe brands you admire or draw inspiration from..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="brand-info">Additional Brand Information</Label>
                  <Textarea 
                    id="brand-info"
                    placeholder="Any other important brand guidelines, fonts, imagery preferences, etc..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BrandSetup;
