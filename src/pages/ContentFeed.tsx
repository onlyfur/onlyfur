import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ContentCard from '@/components/content/ContentCard';
import EnhancedContentFeed from '@/components/content/EnhancedContentFeed';
import EnhancedPricingModal from '@/components/subscription/EnhancedPricingModal';
import { contentAccessService } from '@/services/contentAccessService';
// import { getSortedContent } from '@/data/mockContent'; // Removed mock data
import { Heart, Crown, Star, Filter, Search, Eye, Lock } from 'lucide-react';

const ContentFeed: React.FC = () => {
  // Use the enhanced content feed component with full functionality

  return <EnhancedContentFeed showAdvancedControls={true} />;
};

export default ContentFeed;
