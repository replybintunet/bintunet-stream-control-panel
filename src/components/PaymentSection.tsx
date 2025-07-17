
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Plus, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const PaymentSection: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const creditPercentage = (user.credits / 1000) * 100; // Assuming 1000 is max credits

  return (
    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-200 rounded-lg">
              <Crown className="h-5 w-5 text-red-600" />
            </div>
            <CardTitle className="text-red-900 font-semibold">Subscription</CardTitle>
          </div>
          <Badge 
            variant={user.subscriptionStatus === 'premium' ? 'default' : 'secondary'}
            className={`px-3 py-1 font-medium ${user.subscriptionStatus === 'premium' ? 'bg-red-200 text-red-800 border-red-300' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
          >
            {user.subscriptionStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Credits Display */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-red-800">Credits Available</span>
            <span className="text-2xl font-bold text-red-900">{user.credits}</span>
          </div>
          <Progress 
            value={creditPercentage} 
            className="w-full h-2 bg-red-200"
          />
          <p className="text-xs text-red-700">
            {creditPercentage > 20 ? 'Good balance' : 'Consider adding more credits'}
          </p>
        </div>

        {/* Subscription Features */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-800 mb-3">Current Plan Features</p>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-red-700">
              <Star className="h-3 w-3 mr-2 text-red-600" />
              Up to {user.maxStreams} concurrent streams
            </div>
            <div className="flex items-center text-xs text-red-700">
              <Star className="h-3 w-3 mr-2 text-red-600" />
              HD Quality streaming
            </div>
            <div className="flex items-center text-xs text-red-700">
              <Star className="h-3 w-3 mr-2 text-red-600" />
              24/7 Priority support
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg py-3"
            onClick={() => alert('Payment integration coming soon!')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Credits
          </Button>
          
          {user.subscriptionStatus !== 'premium' && (
            <Button 
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200 rounded-lg py-3"
              onClick={() => alert('Upgrade feature coming soon!')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        {/* Payment Methods */}
        <div className="pt-2 border-t border-red-200">
          <p className="text-xs text-red-700 mb-2">Accepted payments</p>
          <div className="flex items-center space-x-2 text-xs text-red-600">
            <CreditCard className="h-3 w-3" />
            <span>PayPal, Stripe, M-Pesa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
