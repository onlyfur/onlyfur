import React from 'react';

const SubscriptionTiersOverview: React.FC = () => (
  <div className="container mx-auto p-6 max-w-3xl">
    <h1 className="text-3xl font-bold mb-4">Subscription Tiers Overview</h1>
    <p className="mb-4 text-muted-foreground">This help article is a placeholder. Please update with details about OnlyFur's subscription tiers, features, and benefits for each level.</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Basic Tier</li>
      <li>Pro Tier</li>
      <li>VIP Tier</li>
      <li>How to upgrade/downgrade</li>
      <li>Tier-specific perks</li>
    </ul>
    <p className="mt-6 text-sm text-muted-foreground">For more information, contact support or visit the community forums.</p>
  </div>
);

export default SubscriptionTiersOverview;
