import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const tiers = [
    {
      name: 'Bronze',
      price: { monthly: 29, yearly: 290 },
      description: 'For agents ready to take action',
      features: [
        { text: 'Daily coaching tips', included: true },
        { text: 'Access to Bronze-tier courses', included: true },
        { text: 'Full community participation', included: true },
        { text: 'Downloadable resources', included: true },
        { text: 'Email support', included: true },
        { text: 'Access to ALL courses', included: false },
        { text: 'Live coaching sessions', included: false },
        { text: '1-on-1 coaching', included: false },
      ],
      cta: 'Start Bronze',
      popular: false,
      color: 'orange'
    },
    {
      name: 'Silver',
      price: { monthly: 79, yearly: 790 },
      description: 'Most popular for serious agents',
      features: [
        { text: 'Everything in Bronze, plus:', included: true, bold: true },
        { text: 'Access to ALL courses (Bronze + Silver tier)', included: true },
        { text: 'Weekly live coaching sessions', included: true },
        { text: 'Priority community support', included: true },
        { text: 'Exclusive templates & scripts', included: true },
        { text: 'Course certificates', included: true },
        { text: 'Monthly 1-on-1 coaching', included: false },
        { text: 'VIP events', included: false },
      ],
      cta: 'Start Silver',
      popular: true,
      color: 'blue'
    },
    {
      name: 'Gold',
      price: { monthly: 149, yearly: 1490 },
      description: 'For top producers who want it all',
      features: [
        { text: 'Everything in Silver, plus:', included: true, bold: true },
        { text: 'VIP access to ALL premium content', included: true },
        { text: 'Monthly 1-on-1 coaching session', included: true },
        { text: 'Advanced marketing resources', included: true },
        { text: 'Early access to new content', included: true },
        { text: 'Exclusive Gold member events', included: true },
        { text: 'Priority email & phone support', included: true },
        { text: 'Custom branding templates', included: true },
      ],
      cta: 'Start Gold',
      popular: false,
      color: 'amber'
    }
  ];

  const getColorClasses = (color, popular) => {
    if (popular) {
      return {
        border: 'border-4',
        borderColor: '#bb9457',
        button: 'text-white',
        buttonBg: '#6f1d1b',
        badge: 'text-white',
        badgeBg: '#6f1d1b'
      };
    }
    const colors = {
      gray: {
        border: 'border-2 border-gray-200',
        button: 'text-white',
        buttonBg: '#333333',
        badge: 'bg-gray-100 text-gray-800'
      },
      orange: {
        border: 'border-2',
        borderColor: '#bb9457',
        button: 'text-white',
        buttonBg: '#bb9457',
        badge: 'text-white',
        badgeBg: '#bb9457'
      },
      blue: {
        border: 'border-2',
        borderColor: '#6f1d1b',
        button: 'text-white',
        buttonBg: '#6f1d1b',
        badge: 'tkr-burgundy',
        badgeBg: '#ffe6a7'
      },
      amber: {
        border: 'border-2',
        borderColor: '#bb9457',
        button: 'text-white',
        buttonBg: '#bb9457',
        badge: 'text-white',
        badgeBg: '#bb9457'
      }
    };
    return colors[color];
  };

  const getSavings = (tier) => {
    if (tier.price.yearly === 0) return null;
    const monthlyTotal = tier.price.monthly * 12;
    const savings = monthlyTotal - tier.price.yearly;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-tkr-burgundy to-tkr-dark-burgundy text-white py-20" data-testid="pricing-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Success Plan</h1>
            <p className="text-xl text-cream mb-8">
              Start free, upgrade anytime. Cancel whenever you want.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full p-2">
              <span className={`px-4 py-2 ${billingCycle === 'monthly' ? 'font-semibold' : 'opacity-80'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                data-testid="billing-toggle"
              />
              <span className={`px-4 py-2 ${billingCycle === 'yearly' ? 'font-semibold' : 'opacity-80'}`}>
                Yearly
                <span className="ml-2 text-green-300 text-sm font-bold">Save 16%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16" data-testid="pricing-cards">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tiers.map((tier) => {
              const colorClasses = getColorClasses(tier.color, tier.popular);
              const savings = getSavings(tier);
              const price = tier.price[billingCycle];
              
              return (
                <Card
                  key={tier.name}
                  className={`relative ${colorClasses.border} ${tier.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'} hover:shadow-xl transition-all`}
                  style={colorClasses.borderColor ? { borderColor: colorClasses.borderColor } : {}}
                  data-testid={`pricing-card-${tier.name.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span 
                        className={`${colorClasses.badge} text-sm font-bold px-6 py-2 rounded-full shadow-lg whitespace-nowrap`}
                        style={colorClasses.badgeBg ? { backgroundColor: colorClasses.badgeBg } : {}}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-gray-900">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-gray-600 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && savings && (
                        <p className="text-sm text-green-600 font-semibold">
                          Save ${savings.amount}/year ({savings.percentage}%)
                        </p>
                      )}
                    </div>

                    <Link to={tier.name === 'Free' ? '/signup' : '/signup'}>
                      <Button
                        className={`w-full rounded-full ${colorClasses.button}`}
                        style={colorClasses.buttonBg ? { backgroundColor: colorClasses.buttonBg } : {}}
                        size="lg"
                        data-testid={`cta-${tier.name.toLowerCase()}`}
                      >
                        {tier.cta}
                      </Button>
                    </Link>

                    <div className="pt-4 border-t space-y-3">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {feature.included ? (
                            <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${feature.bold ? 'font-semibold text-gray-900' : feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white" data-testid="features-comparison">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compare All Features</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Bronze</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Silver</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Gold</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Daily Tips', true, true, true, true],
                  ['Podcast Access', true, true, true, true],
                  ['Course Access', false, 'Bronze Only', 'All Courses', 'All Courses'],
                  ['Community', 'Read Only', 'Full Access', 'Priority', 'VIP'],
                  ['Live Coaching', false, false, 'Weekly', 'Weekly'],
                  ['1-on-1 Coaching', false, false, false, 'Monthly'],
                  ['Resources Library', false, true, true, true],
                  ['Templates & Scripts', false, false, true, true],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">{row[0]}</td>
                    {row.slice(1).map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-4 text-center">
                        {typeof cell === 'boolean' ? (
                          cell ? (
                            <Check size={20} className="inline text-green-600" />
                          ) : (
                            <X size={20} className="inline text-gray-300" />
                          )
                        ) : (
                          <span className="text-sm text-gray-700">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee */}
      <section className="py-16 bg-green-50" data-testid="guarantee-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
          <p className="text-lg text-gray-600 mb-6">
            Try TKR Coaching risk-free. If you're not satisfied within the first 30 days, we'll refund your full payment. No questions asked.
          </p>
          <p className="text-sm text-gray-500">
            Plus: Cancel anytime • No cancellation fees • Keep your progress
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pricing FAQs</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What happens when I cancel?',
                a: 'You\'ll keep access until the end of your billing period. Your progress and data are saved for 90 days if you want to return.'
              },
              {
                q: 'Do you offer discounts for teams?',
                a: 'Yes! Teams of 5+ agents get special pricing. Contact us for a custom quote.'
              },
              {
                q: 'Is the yearly plan really cheaper?',
                a: 'Absolutely! Yearly plans save you 16% compared to paying monthly.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
