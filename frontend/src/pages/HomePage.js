import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Users, Podcast, TrendingUp, Award, CheckCircle2, Star, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [heroContent, setHeroContent] = useState({
    headline: 'Transform Your Real Estate Career From Your Pocket',
    subheadline: 'Expert-led courses, coaching, and community designed for ambitious real estate professionals',
    cta_text: 'Download Now & Start Learning'
  });

  useEffect(() => {
    // Fetch hero content
    axios.get(`${API_URL}/content/homepage_hero`)
      .then(res => {
        if (res.data.data && Object.keys(res.data.data).length > 0) {
          setHeroContent(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching hero content:', err));

    // Fetch stats
    axios.get(`${API_URL}/admin/analytics/content`)
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching stats:', err));

    // Fetch latest podcasts
    axios.get(`${API_URL}/podcast/episodes`)
      .then(res => setPodcasts(res.data.slice(0, 3)))
      .catch(err => console.error('Error fetching podcasts:', err));

    // Fetch community posts
    axios.get(`${API_URL}/community/posts`)
      .then(res => setCommunityPosts(res.data.slice(0, 2)))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 50%, #ffe6a7 100%)' }} data-testid="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-medium px-4 py-2 rounded-full" style={{ backgroundColor: '#ffe6a7', color: '#6f1d1b' }}>
                  Trusted by 10,000+ Real Estate Professionals
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#6f1d1b' }} data-testid="hero-heading">
                {heroContent.headline}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="hero-subheading">
                {heroContent.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#6f1d1b' }}
                    data-testid="hero-cta-primary"
                  >
                    <Download className="mr-2" size={20} />
                    {heroContent.cta_text}
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg rounded-full hover:opacity-80 transition-opacity"
                    style={{ borderColor: '#bb9457', borderWidth: '2px', color: '#6f1d1b' }}
                    data-testid="hero-cta-secondary"
                  >
                    Browse Courses
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2" data-testid="trust-badge-rating">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-current" style={{ color: '#bb9457' }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">4.9 App Rating</span>
                </div>
                <div className="flex items-center space-x-2" data-testid="trust-badge-members">
                  <Users size={16} style={{ color: '#6f1d1b' }} />
                  <span className="text-sm font-medium text-gray-700">
                    {stats ? `${stats.total_users.toLocaleString()}+ Active Members` : '10,000+ Active Members'}
                  </span>
                </div>
                <div className="flex items-center space-x-2" data-testid="trust-badge-courses">
                  <Award size={16} style={{ color: '#6f1d1b' }} />
                  <span className="text-sm font-medium text-gray-700">
                    {stats ? `${stats.total_courses}+ Courses` : '50+ Expert Courses'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image - App Mockup */}
            <div className="relative" data-testid="hero-image">
              <div className="relative z-10">
                <img
                  src="https://customer-assets.emergentagent.com/job_realestate-pro-35/artifacts/k2f1umpq_mobileapp.JPG"
                  alt="TKR Coaching Mobile App"
                  className="rounded-3xl shadow-2xl w-full h-auto"
                  style={{ maxWidth: '600px', minHeight: '400px', display: 'block' }}
                  loading="eager"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-72 h-72 opacity-30 rounded-full blur-3xl" style={{ backgroundColor: '#ffe6a7' }}></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 opacity-30 rounded-full blur-3xl" style={{ backgroundColor: '#bb9457' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white" data-testid="social-proof-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Agents
            </h2>
            <p className="text-lg text-gray-600">
              See how TKR Coaching helped agents like you achieve breakthrough success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I closed 8 more deals in 90 days after implementing the scripts from the listing course. Game changer!",
                name: "Sarah Martinez",
                role: "Realtor, Miami, FL",
                metric: "+8 deals in 90 days"
              },
              {
                quote: "The social media course helped me generate 23 qualified leads last month. Best investment I've made.",
                name: "Michael Chen",
                role: "Broker Associate, Austin, TX",
                metric: "23 leads/month"
              },
              {
                quote: "Increased my GCI by $47K in my first year thanks to the negotiation masterclass.",
                name: "Jennifer Lopez",
                role: "Agent, Los Angeles, CA",
                metric: "+$47K GCI"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow" data-testid={`testimonial-card-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-current tkr-gold" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="mt-2 inline-block bg-cream tkr-burgundy text-sm font-medium px-3 py-1 rounded-full">
                      {testimonial.metric}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-cream-light" data-testid="problem-solution-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Real Estate Success Shouldn't Be This Complicated
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-red-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Without TKR Coaching:</h3>
                  <ul className="space-y-3">
                    {[
                      'Overwhelmed by outdated training',
                      'No time for lengthy courses',
                      'Struggling to stay consistent',
                      'Missing out on proven strategies',
                      'Feeling isolated and unsupported'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">With TKR Coaching:</h3>
                  <ul className="space-y-3">
                    {[
                      'Modern, mobile-first learning',
                      'Bite-sized lessons you can complete anywhere',
                      'Daily accountability and tips',
                      'Cutting-edge strategies that work',
                      'Supportive community of top agents'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/signup">
                <Button size="lg" className="bg-tkr-burgundy hover:opacity-90 text-white px-8 rounded-full">
                  Start Your Transformation Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-white" data-testid="features-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed, Right in Your Pocket
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive mobile platform designed specifically for ambitious real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen size={32} className="tkr-burgundy" />,
                title: 'Expert-Led Video Courses',
                description: 'Full course library with progress tracking, certificates, and lifetime access'
              },
              {
                icon: <TrendingUp size={32} className="tkr-burgundy" />,
                title: 'Daily/Weekly Tips',
                description: 'Bite-sized actionable insights delivered right to your phone every day'
              },
              {
                icon: <Play size={32} className="tkr-burgundy" />,
                title: 'Live Coaching Sessions',
                description: 'Zoom-integrated live events with recordings and Q&A with top coaches'
              },
              {
                icon: <Users size={32} className="tkr-burgundy" />,
                title: 'Thriving Community',
                description: 'Real-time discussions, networking, and support from fellow agents'
              },
              {
                icon: <Podcast size={32} className="tkr-burgundy" />,
                title: 'Podcast Streaming',
                description: 'Full podcast player with offline downloads and speed control'
              },
              {
                icon: <Award size={32} className="tkr-burgundy" />,
                title: 'Resources Library',
                description: 'eBooks, workbooks, templates, and scripts ready to use'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-tkr-gold hover:shadow-xl transition-all duration-300 group" data-testid={`feature-card-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Preview */}
      {podcasts.length > 0 && (
        <section className="py-20 text-white" style={{ background: 'linear-gradient(135deg, #6f1d1b 0%, #4a1312 100%)' }} data-testid="podcast-preview-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Podcast Episodes
              </h2>
              <p className="text-lg text-cream">
                Free for everyone! Listen, learn, and level up your business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {podcasts.map((episode) => (
                <Card key={episode.id} className="border-0 hover:shadow-xl transition-all" style={{ backgroundColor: '#fff9e6' }}>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-full bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-full h-full object-cover rounded-lg"
                        style={{ minHeight: '250px', display: 'block' }}
                        loading="lazy"
                        onError={(e) => {
                          console.error('Homepage podcast image failed:', episode.thumbnail);
                          e.target.style.display = 'block';
                          e.target.style.minHeight = '250px';
                          e.target.style.width = '100%';
                          e.target.style.backgroundColor = '#e5e7eb';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm" style={{ color: '#bb9457' }}>
                        <span>Season {episode.season} • Episode {episode.episode}</span>
                        <span>{episode.duration}</span>
                      </div>
                      <h3 className="text-lg font-bold" style={{ color: '#6f1d1b' }}>{episode.title}</h3>
                      <p className="text-sm line-clamp-2" style={{ color: '#666666' }}>{episode.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/podcast">
                <Button size="lg" variant="outline" className="bg-white tkr-burgundy hover:bg-cream-light border-0 px-8 rounded-full">
                  View All Episodes
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50" data-testid="pricing-preview-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Success Plan
            </h2>
            <p className="text-lg text-gray-600">
              Upgrade anytime. Cancel whenever you want.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Bronze', price: '$29', cta: 'Start Bronze', popular: false },
              { name: 'Silver', price: '$79', cta: 'Start Silver', popular: true },
              { name: 'Gold', price: '$149', cta: 'Start Gold', popular: false }
            ].map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.popular ? 'border-4 shadow-xl scale-105' : 'border-2'
                }`}
                style={tier.popular ? { borderColor: '#bb9457' } : {}}
                data-testid={`pricing-card-${tier.name.toLowerCase()}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="text-white text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: '#6f1d1b' }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 space-y-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  <div>
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <Link to="/pricing">
                    <Button
                      className="w-full rounded-full text-white"
                      style={{ backgroundColor: tier.popular ? '#6f1d1b' : '#bb9457' }}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button variant="link" className="tkr-burgundy">
                Compare all plans and features →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" data-testid="faq-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: 'Can I use the same login on web and mobile?',
                answer: 'Yes! Your account works seamlessly across our website and mobile app. Sign in once and access your content anywhere.'
              },
              {
                question: 'What devices are supported?',
                answer: 'TKR Coaching works on iOS (iPhone/iPad), Android phones/tablets, and any modern web browser on desktop or laptop.'
              },
              {
                question: 'Can I download content for offline use?',
                answer: 'Absolutely! Bronze, Silver, and Gold members can download courses and podcast episodes to watch or listen offline.'
              },
              {
                question: 'How do I cancel my subscription?',
                answer: 'You can cancel anytime from your account dashboard. No questions asked, no cancellation fees.'
              },
              {
                question: 'Is there a money-back guarantee?',
                answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your full payment.'
              },
              {
                question: 'Do you offer team or brokerage plans?',
                answer: 'Yes! Contact us for special pricing for teams of 5+ agents or entire brokerages.'
              },
              {
                question: 'Are the courses updated regularly?',
                answer: 'We update our content monthly to reflect the latest market trends, strategies, and real estate news.'
              },
              {
                question: 'What makes TKR Coaching different?',
                answer: 'We\'re mobile-first, community-driven, and focused on actionable strategies. Plus, you get daily tips, live coaching, and a supportive network—not just recorded courses.'
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:tkr-burgundy">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-tkr-burgundy to-tkr-dark-burgundy text-white" data-testid="final-cta-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
            Join 10,000+ agents already using TKR Coaching to close more deals and build thriving businesses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white tkr-burgundy hover:bg-cream-light px-8 py-6 text-lg rounded-full shadow-xl"
                data-testid="final-cta-signup"
              >
                <Download className="mr-2" size={20} />
                Get Started Today Today
              </Button>
            </Link>
            <Link to="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
                data-testid="final-cta-courses"
              >
                Explore Courses
              </Button>
            </Link>
          </div>

          <p className="mt-6 opacity-80">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
