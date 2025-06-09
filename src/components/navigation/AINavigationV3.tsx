import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import {
  Brain,
  Sparkles,
  Home,
  Compass,
  User,
  MessageSquare,
  BarChart3,
  Settings,
  Camera,
  Users,
  Target,
  Zap,
  Shield,
  Lightbulb,
  TrendingUp,
  Clock,
  Star,
  Bell,
  Search,
  Menu,
  X,
  Activity,
  Award,
  ChevronDown,
  Plus,
  Radio
} from 'lucide-react';

interface AIFeature {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  badge?: string;
  isNew?: boolean;
}

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  route: string;
  badge?: string;
  aiFeatures?: AIFeature[];
}

export default function AINavigationV3() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(7);
  const location = useLocation();

  // Mock user data
  const user = {
    name: 'Creative Fox',
    username: '@creativefox',
    avatar: '/api/placeholder/40/40',
    tier: 'premium',
    aiScore: 94
  };

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      icon: Activity,
      route: '/ai-dashboard',
      aiFeatures: [
        {
          name: 'AI Dashboard',
          description: 'Your personalized AI-powered creator overview',
          icon: Brain,
          route: '/ai-dashboard',
          badge: 'NEW',
          isNew: true
        },
        {
          name: 'AI Insights',
          description: 'Get intelligent recommendations for your content',
          icon: Lightbulb,
          route: '/ai-insights'
        },
        {
          name: 'Performance Analytics',
          description: 'AI-powered deep dive into your content performance',
          icon: TrendingUp,
          route: '/ai-analytics'
        }
      ]
    },
    {
      name: 'Content',
      icon: Sparkles,
      route: '/content',
      badge: '3',
      aiFeatures: [
        {
          name: 'Content Optimizer',
          description: 'Optimize your posts for maximum engagement',
          icon: Target,
          route: '/ai-optimizer',
          badge: 'HOT',
          isNew: true
        },
        {
          name: 'AI Content Ideas',
          description: 'Get personalized content suggestions',
          icon: Lightbulb,
          route: '/content-ideas'
        },
        {
          name: 'Trending Analysis',
          description: 'See what\'s trending in your niche',
          icon: TrendingUp,
          route: '/trending'
        },
        {
          name: 'Content Scheduler',
          description: 'Schedule posts for optimal engagement times',
          icon: Clock,
          route: '/scheduler'
        }
      ]
    },
    {
      name: 'Community',
      icon: Users,
      route: '/community',
      aiFeatures: [
        {
          name: 'Community Manager',
          description: 'AI-powered community insights and moderation',
          icon: Shield,
          route: '/community-manager',
          badge: 'NEW',
          isNew: true
        },
        {
          name: 'Engagement Analytics',
          description: 'Understand your audience behavior patterns',
          icon: BarChart3,
          route: '/engagement-analytics'
        },
        {
          name: 'Member Insights',
          description: 'AI analysis of your most engaged followers',
          icon: Users,
          route: '/member-insights'
        }
      ]
    },
    {
      name: 'Live Studio',
      icon: Camera,
      route: '/live-studio',
      badge: 'LIVE',
      aiFeatures: [
        {
          name: 'AI Live Studio',
          description: 'Stream with AI-powered engagement tools',
          icon: Radio,
          route: '/live-studio',
          badge: 'NEW',
          isNew: true
        },
        {
          name: 'Stream Analytics',
          description: 'Real-time AI insights during your streams',
          icon: Activity,
          route: '/stream-analytics'
        },
        {
          name: 'Auto Moderator',
          description: 'AI chat moderation for a safe environment',
          icon: Shield,
          route: '/auto-moderator'
        }
      ]
    }
  ];

  const standardNavItems = [
    { name: 'Home', icon: Home, route: '/home' },
    { name: 'Explore', icon: Compass, route: '/explore' },
    { name: 'Messages', icon: MessageSquare, route: '/messages', badge: '5' },
    { name: 'Profile', icon: User, route: '/profile' }
  ];

  const isActive = (route: string) => {
    return location.pathname === route;
  };

  const hasActiveFeature = (features?: AIFeature[]) => {
    return features?.some(feature => isActive(feature.route)) || false;
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAiInsights(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      setUnreadNotifications(prev => Math.max(0, prev + (Math.random() > 0.8 ? 1 : -1)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                OnlyFur AI
              </div>
              <div className="text-xs text-gray-500">v3.9 Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* AI-Powered Features */}
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isItemActive = isActive(item.route) || hasActiveFeature(item.aiFeatures);
                  
                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuTrigger 
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          isItemActive 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'LIVE' ? 'destructive' : 'secondary'}
                            className={`text-xs ${
                              item.badge === 'LIVE' ? 'animate-pulse' : ''
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-96">
                          <div className="flex items-center space-x-2 mb-3">
                            <Brain className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-purple-800">AI-Powered {item.name}</h3>
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          </div>
                          {item.aiFeatures?.map((feature) => {
                            const FeatureIcon = feature.icon;
                            return (
                              <NavigationMenuLink key={feature.name} asChild>
                                <Link
                                  to={feature.route}
                                  className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 focus:bg-purple-50 ${
                                    isActive(feature.route) ? 'bg-purple-100' : ''
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 mb-1">
                                    <FeatureIcon className="w-4 h-4 text-purple-600" />
                                    <div className="text-sm font-medium leading-none">
                                      {feature.name}
                                    </div>
                                    {feature.badge && (
                                      <Badge 
                                        variant={feature.isNew ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {feature.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-gray-600">
                                    {feature.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            );
                          })}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}

                {/* Standard Navigation Items */}
                {standardNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <Link
                        to={item.route}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          isActive(item.route)
                            ? 'bg-gray-100 text-gray-900'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* AI Score */}
            <div className="hidden md:flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI Score:</span>
              <span className="text-sm font-bold text-purple-800">{user.aiScore}</span>
            </div>

            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="w-4 h-4" />
            </Button>

            {/* AI Insights */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              asChild
            >
              <Link to="/ai-insights">
                <Lightbulb className="w-4 h-4" />
                {aiInsights > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-purple-500 text-white text-xs">
                    {aiInsights}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{user.tier}</span>
                </div>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-gray-200"
            >
              <div className="space-y-4">
                {/* AI Features Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3 px-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">AI Features</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.name}>
                          <Link
                            to={item.route}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                              isActive(item.route) ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                          {item.aiFeatures && (
                            <div className="ml-8 mt-2 space-y-1">
                              {item.aiFeatures.slice(0, 2).map((feature) => {
                                const FeatureIcon = feature.icon;
                                return (
                                  <Link
                                    key={feature.name}
                                    to={feature.route}
                                    className={`flex items-center space-x-2 px-2 py-1 rounded text-sm transition-all ${
                                      isActive(feature.route) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <FeatureIcon className="w-4 h-4" />
                                    <span>{feature.name}</span>
                                    {feature.badge && (
                                      <Badge variant="outline" className="text-xs ml-auto">
                                        {feature.badge}
                                      </Badge>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Standard Navigation */}
                <div>
                  <div className="font-semibold text-gray-800 mb-3 px-2">Navigation</div>
                  <div className="space-y-2">
                    {standardNavItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.route}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                            isActive(item.route) ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile User Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 px-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>CF</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{user.tier}</span>
                        <span>•</span>
                        <Brain className="w-3 h-3 text-purple-500" />
                        <span>AI Score: {user.aiScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}