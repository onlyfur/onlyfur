import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Crown,
  Star,
  Gift,
  Palette,
  Save,
  MoreHorizontal,
  Eye,
  EyeOff,
} from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { SubscriptionTier, TierFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const tierSchema = z.object({
  name: z.string().min(1, 'Tier name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  price: z.number().min(0, 'Price must be positive').max(1000, 'Price must be less than $1000'),
  benefits: z.array(z.string().min(1, 'Benefit cannot be empty')).min(1, 'At least one benefit is required'),
  color: z.string().min(1, 'Color is required'),
  contentAccess: z.enum(['all', 'tier-specific', 'premium-only']),
});

type TierFormValues = z.infer<typeof tierSchema>;

const SubscriptionSettings: React.FC = () => {
  const { subscriptionTiers, createTier, updateTier, deleteTier, isLoading } = usePayment();
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TierFormValues>({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      benefits: [''],
      color: '#3B82F6',
      contentAccess: 'tier-specific',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const [benefits, setBenefits] = useState<string[]>(['']);

  const watchedColor = watch('color');
  const watchedPrice = watch('price');

  const colorOptions = [
    { value: '#3B82F6', name: 'Blue', class: 'bg-blue-500' },
    { value: '#8B5CF6', name: 'Purple', class: 'bg-purple-500' },
    { value: '#F59E0B', name: 'Yellow', class: 'bg-yellow-500' },
    { value: '#10B981', name: 'Green', class: 'bg-green-500' },
    { value: '#EF4444', name: 'Red', class: 'bg-red-500' },
    { value: '#F97316', name: 'Orange', class: 'bg-orange-500' },
    { value: '#EC4899', name: 'Pink', class: 'bg-pink-500' },
    { value: '#6366F1', name: 'Indigo', class: 'bg-indigo-500' },
  ];

  const onSubmit = async (data: TierFormValues) => {
    try {
      const tierData: TierFormData = {
        name: data.name,
        description: data.description,
        price: data.price,
        benefits: data.benefits.filter(benefit => benefit.trim() !== ''),
        color: data.color,
        contentAccess: data.contentAccess,
      };

      if (editingTier) {
        await updateTier(editingTier.id, tierData);
        toast({
          title: 'Tier Updated',
          description: 'Your subscription tier has been updated successfully.',
        });
      } else {
        await createTier(tierData);
        toast({
          title: 'Tier Created',
          description: 'Your new subscription tier has been created successfully.',
        });
      }

      setIsDialogOpen(false);
      setEditingTier(null);
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save subscription tier. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (tier: SubscriptionTier) => {
    setEditingTier(tier);
    setValue('name', tier.name);
    setValue('description', tier.description);
    setValue('price', tier.price / 100); // Convert from cents
    setValue('benefits', tier.benefits);
    setValue('color', tier.color);
    setValue('contentAccess', tier.contentAccess);
    setBenefits(tier.benefits);
    setIsDialogOpen(true);
  };

  const handleDelete = async (tierId: string) => {
    try {
      await deleteTier(tierId);
      toast({
        title: 'Tier Deleted',
        description: 'Subscription tier has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subscription tier. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleNewTier = () => {
    setEditingTier(null);
    reset({
      name: '',
      description: '',
      price: 0,
      benefits: [''],
      color: '#3B82F6',
      contentAccess: 'tier-specific',
    });
    setBenefits(['']);
    setIsDialogOpen(true);
  };

  const toggleTierStatus = async (tier: SubscriptionTier) => {
    try {
      await updateTier(tier.id, { isActive: !tier.isActive });
      toast({
        title: tier.isActive ? 'Tier Disabled' : 'Tier Enabled',
        description: `Subscription tier has been ${tier.isActive ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tier status.',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const getAccessLevelText = (access: string) => {
    switch (access) {
      case 'all':
        return 'All Content';
      case 'tier-specific':
        return 'Tier Content';
      case 'premium-only':
        return 'Premium Only';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Settings</h1>
          <p className="text-muted-foreground">
            Manage your subscription tiers and pricing to monetize your content
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTier}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTier ? 'Edit Subscription Tier' : 'Create New Subscription Tier'}
              </DialogTitle>
              <DialogDescription>
                Set up your subscription tier with pricing, benefits, and access levels.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Premium, VIP, Basic"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1000"
                    placeholder="9.99"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what subscribers get with this tier..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label>Tier Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue('color', color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                        watchedColor === color.value ? 'border-foreground' : 'border-transparent'
                      } hover:scale-110 transition-transform`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Content Access */}
              <div className="space-y-2">
                <Label htmlFor="contentAccess">Content Access Level</Label>
                <Select
                  value={watch('contentAccess')}
                  onValueChange={(value: any) => setValue('contentAccess', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content - Full access to everything</SelectItem>
                    <SelectItem value="tier-specific">Tier Content - Access to tier-specific content</SelectItem>
                    <SelectItem value="premium-only">Premium Only - Access to premium content only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <Label>Benefits & Features</Label>
                <div className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Benefit ${index + 1}...`}
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...benefits];
                          newBenefits[index] = e.target.value;
                          setBenefits(newBenefits);
                          setValue('benefits', newBenefits.filter(b => b.trim()));
                        }}
                      />
                      {benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newBenefits = benefits.filter((_, i) => i !== index);
                            setBenefits(newBenefits);
                            setValue('benefits', newBenefits.filter(b => b.trim()));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBenefits([...benefits, ''])}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>
                {errors.benefits && (
                  <p className="text-sm text-destructive">{errors.benefits.message}</p>
                )}
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="border-2" style={{ borderColor: watchedColor }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: watchedColor }}
                          />
                          {watch('name') || 'Tier Name'}
                        </CardTitle>
                        <CardDescription>{watch('description') || 'Tier description'}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${watchedPrice?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-muted-foreground">/month</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {watch('benefits')?.filter(b => b.trim()).map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <Badge variant="secondary" className="mt-3">
                      {getAccessLevelText(watch('contentAccess'))}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingTier ? 'Update Tier' : 'Create Tier'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tiers</p>
                <p className="text-2xl font-bold">
                  {subscriptionTiers.filter(t => t.isActive).length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">
                  {subscriptionTiers.reduce((sum, tier) => sum + tier.subscriberCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(
                    subscriptionTiers.reduce((sum, tier) => sum + (tier.price * tier.subscriberCount), 0)
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold">
                  {subscriptionTiers.length > 0
                    ? formatPrice(
                        subscriptionTiers.reduce((sum, tier) => sum + tier.price, 0) / subscriptionTiers.length
                      )
                    : '$0.00'
                  }
                </p>
              </div>
              <Gift className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Tiers */}
      {subscriptionTiers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Subscription Tiers</h3>
            <p className="text-muted-foreground mb-4">
              Create your first subscription tier to start monetizing your content
            </p>
            <Button onClick={handleNewTier}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tier
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.id} className={`border-2 ${tier.isActive ? 'border-current' : 'border-muted opacity-75'}`} style={{ borderColor: tier.isActive ? tier.color : undefined }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: tier.color }}
                    />
                    <div>
                      <CardTitle className="flex items-center">
                        {tier.name}
                        {!tier.isActive && <EyeOff className="w-4 h-4 ml-2 text-muted-foreground" />}
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(tier)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Tier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleTierStatus(tier)}>
                        {tier.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Disable Tier
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Enable Tier
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(tier.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Tier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price and Subscribers */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {formatPrice(tier.price)}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{tier.subscriberCount}</div>
                      <div className="text-xs text-muted-foreground">subscribers</div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Benefits:</h4>
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-3 h-3 mr-2 text-yellow-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Access Level */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant="secondary">
                      {getAccessLevelText(tier.contentAccess)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(tier.price * tier.subscriberCount)}/month revenue
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
