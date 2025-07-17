
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, DollarSign, Smartphone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const PaymentSection: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const creditPercentage = (user.credits / 200) * 100; // Assuming 200 is max credits

  const handlePayment = (method: string) => {
    // This would integrate with actual payment providers
    console.log(`Opening ${method} payment...`);
    
    // Simulate payment modal/redirect
    window.open(`https://payment-demo.com/${method}`, '_blank');
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Subscription & Credits</CardTitle>
        <CardDescription className="text-slate-400">
          Manage your account and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Current Plan</span>
            <Badge 
              variant={user.subscriptionStatus === 'premium' ? 'default' : 'secondary'}
              className={user.subscriptionStatus === 'premium' ? 'bg-purple-500' : ''}
            >
              {user.subscriptionStatus.toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Credits</span>
              <span className="text-white font-medium">{user.credits} / 200</span>
            </div>
            <Progress value={creditPercentage} className="h-2" />
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-200">Add Credits</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePayment('stripe')}
              className="justify-start border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Credit Card (Stripe)
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePayment('paypal')}
              className="justify-start border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              PayPal
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePayment('mpesa')}
              className="justify-start border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              M-Pesa
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </div>
        </div>

        {/* Subscription Benefits */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-200 mb-2">Premium Benefits</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Up to 2 concurrent streams</li>
            <li>• 1080p streaming quality</li>
            <li>• Custom overlay text</li>
            <li>• Priority support</li>
            <li>• Extended streaming duration</li>
          </ul>
        </div>

        {user.subscriptionStatus === 'free' && (
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            onClick={() => handlePayment('upgrade')}
          >
            Upgrade to Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
