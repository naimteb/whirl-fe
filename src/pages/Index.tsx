import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, ArrowRight, Play, Zap, Clock, Users, Image, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth0 } from '@auth0/auth0-react';

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Multi-Platform Automation",
      description: "Instagram, X/Twitter, LinkedIn, Facebook, Threads, YouTube Shorts"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Smart Content Generation",
      description: "Platform-specific tone and formatting tailored to each audience"
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "Visual Creation",
      description: "Curated image templates and placeholders"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Smart Approval System",
      description: "Gmail + Telegram notifications for seamless workflow"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Content Archiving",
      description: "Google Drive integration for organized content management"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Scheduling & Publishing",
      description: "Post when your audience is most active"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["5 posts/month", "2 platforms", "Basic templates", "Email support"],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Starter",
      price: "$29",
      period: "month",
      features: ["50 posts/month", "All platforms", "Advanced templates", "Priority support"],
      cta: "Start Creating",
      popular: true
    },
    {
      name: "Team",
      price: "$79",
      period: "month",
      features: ["200 posts/month", "Team collaboration", "Advanced analytics", "Custom branding"],
      cta: "Upgrade to Team",
      popular: false
    },
    {
      name: "Pro Agency",
      price: "$199",
      period: "month",
      features: ["Unlimited posts", "White-label options", "API access", "Dedicated support"],
      cta: "Go Pro",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the system understand different platform requirements?",
      answer: "Our system uses platform-specific best practices, character limits, and audience preferences. It automatically adapts content tone, length, and format for each platform."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Absolutely! Every generated post can be edited before publishing. You can also set brand guidelines to ensure all content matches your voice and style."
    },
    {
      question: "What image generation options are available?",
      answer: "We provide curated image templates and placeholders that match your brand aesthetic and content theme."
    },
    {
      question: "How does the approval system work?",
      answer: "You'll receive notifications via Gmail and Telegram when content is ready for review. You can approve, edit, or regenerate content before it goes live."
    },
    {
      question: "Which platforms do you support?",
      answer: "We support Instagram, X/Twitter, LinkedIn, Facebook, Threads, and YouTube Shorts, with more platforms being added regularly."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Whirl</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600"> {user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Log out
                </Button>
                <Link to="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
              <Button variant="outline" size="sm" onClick={() => loginWithRedirect({
                authorizationParams: {
                  connection:'Username-Password-Authentication',
                  screen_hint: 'signup'
                },
              })}>
                Sign up
              </Button>

                <Button variant="outline" size="sm" onClick={() => loginWithRedirect(
                  {
                    authorizationParams: {
                      prompt: "login"  // Forces re-entry of credentials every time
                    }
                  }
                )}>
                  Log in
                </Button>
                <Link to="/dashboard">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>

            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            ✨ Smart Content Automation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Content.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Motion.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Smart content automation that turns one idea into platform-perfect posts across Instagram, X, LinkedIn, Facebook, Threads, and YouTube Shorts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Creating for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Animated Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See Whirl in Action</h2>
            <p className="text-gray-600">Watch how one idea becomes perfect posts for every platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Describe Your Idea</h3>
              <p className="text-sm text-gray-600">Natural language input</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">System Creates Content</h3>
              <p className="text-sm text-gray-600">Platform-specific optimization</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Review & Publish</h3>
              <p className="text-sm text-gray-600">Multi-platform posting</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Content Strategy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stop spending hours on content creation. Let our system handle the heavy lifting while you focus on growing your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Save 10+ hours every week", icon: "⏰" },
            { title: "Stay consistent across all platforms", icon: "🎯" },
            { title: "Never miss a posting opportunity", icon: "📅" },
            { title: "Professional visuals, zero design skills needed", icon: "🎨" }
          ].map((benefit, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <p className="font-semibold text-gray-900">{benefit.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your content creation and publishing workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <Star className="h-8 w-8 mx-auto mb-4 text-yellow-300" />
            <blockquote className="text-xl font-semibold mb-4">
              "Whirl transformed our content strategy. What used to take our team 6 hours now takes 20 minutes."
            </blockquote>
            <cite className="text-blue-100">— Marketing Director, TechCorp</cite>
          </CardContent>
        </Card>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core content generation features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 transition-all hover:shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Whirl and content automation
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="text-xl font-bold">Whirl</span>
              </div>
              <p className="text-gray-400 mb-4">
                Put your content in motion with smart automation
              </p>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Ready to put your content in motion?
                </Button>
              </Link>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Whirl. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
