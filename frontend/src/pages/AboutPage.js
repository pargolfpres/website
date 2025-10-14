import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Users, Heart, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="about-page">
      {/* Header */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #6f1d1b 0%, #4a1312 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About TKR Coaching</h1>
            <p className="text-xl leading-relaxed">
              Empowering real estate professionals to achieve extraordinary success through 
              world-class coaching, proven strategies, and a supportive community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: '#6f1d1b' }}>Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded by Todd K. Roberson — award-winning mortgage expert, author, speaker, and Certified Veteran Lending Specialist — our mission is simple: to help driven professionals close the gap between what they know and what they do.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                With more than 16 years of experience in real estate and lending, Todd has built a proven framework that blends coaching, accountability, and community to create measurable business growth. Through our results-driven programs, we focus on building habits, systems, and strategies that generate real, sustainable success.
              </p>
              <p className="text-lg text-gray-700">
                Because in business and in life, education without implementation is just information — and implementation is where the results live.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <img
                src="https://customer-assets.emergentagent.com/job_realestate-pro-35/artifacts/elh4rf6l_walllogoTR2.png"
                alt="TKR Logo"
                className="w-48 h-48 mx-auto mb-6"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Todd K. Roberson</h3>
                <p className="text-lg" style={{ color: '#bb9457' }}>Founder & Lead Coach</p>
                <p className="text-sm text-gray-600 mt-2">Award-Winning Mortgage Expert & Certified Veteran Lending Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#6f1d1b' }}>Your Complete Success Ecosystem</h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Our coaching platform and mobile app provide members with everything they need to succeed:
          </p>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Award size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Self-Paced Online Courses</h3>
                    <p className="text-gray-700">
                      Teach actionable real estate and business growth strategies you can implement immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Users size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Live and Group Coaching Sessions</h3>
                    <p className="text-gray-700">
                      For skill development and accountability with expert coaches and peers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Target size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Goal Tracking & Personalized Content</h3>
                    <p className="text-gray-700">
                      Reminders and personalized content recommendations to keep you consistent and on track.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Heart size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Private Community Access</h3>
                    <p className="text-gray-700">
                      Network with top-performing agents and professionals who share your commitment to excellence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <TrendingUp size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Downloadable Tools & Resources</h3>
                    <p className="text-gray-700">
                      Templates and marketing resources to help you implement strategies immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8" style={{ color: '#6f1d1b' }}>Who We Serve</h2>
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            Whether you're a new agent looking for structure or a seasoned pro ready to scale, our system gives you the clarity, tools, and accountability to execute consistently — and win with confidence.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16" style={{ backgroundColor: '#fff9e6' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#6f1d1b' }}>Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2" style={{ borderColor: '#bb9457' }}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#6f1d1b' }}>
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#6f1d1b' }}>Excellence</h3>
                <p className="text-gray-700">
                  We deliver world-class content and coaching that drives real results for our members.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: '#bb9457' }}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#6f1d1b' }}>
                  <Heart size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#6f1d1b' }}>Community</h3>
                <p className="text-gray-700">
                  We foster a supportive environment where agents help each other grow and succeed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: '#bb9457' }}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#6f1d1b' }}>
                  <TrendingUp size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#6f1d1b' }}>Growth</h3>
                <p className="text-gray-700">
                  We believe in continuous improvement and provide the tools for lifelong learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#6f1d1b' }}>Our Impact</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2" style={{ color: '#6f1d1b' }}>10,000+</p>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2" style={{ color: '#6f1d1b' }}>50+</p>
              <p className="text-gray-600">Expert Courses</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2" style={{ color: '#6f1d1b' }}>100+</p>
              <p className="text-gray-600">Podcast Episodes</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2" style={{ color: '#6f1d1b' }}>4.9</p>
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-current" style={{ color: '#bb9457' }} />
                ))}
              </div>
              <p className="text-gray-600 mt-2">App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16" style={{ backgroundColor: '#fff9e6' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#6f1d1b' }}>Why Choose TKR Coaching?</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Target size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Proven Strategies</h3>
                    <p className="text-gray-700">
                      Our courses are built on real-world experience and proven methodologies that have helped 
                      thousands of agents increase their production and close more deals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Users size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Expert Instructors</h3>
                    <p className="text-gray-700">
                      Learn from top-producing agents and industry leaders who share their insider strategies, 
                      scripts, and tactics for success in today's competitive market.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <TrendingUp size={32} className="flex-shrink-0 mt-1" style={{ color: '#6f1d1b' }} />
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#6f1d1b' }}>Mobile-First Platform</h3>
                    <p className="text-gray-700">
                      Access your training anytime, anywhere. Our mobile app lets you learn during your commute, 
                      between appointments, or whenever you have a few minutes to invest in your growth.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#6f1d1b' }}>Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of agents who are already using TKR Coaching to build thriving businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-white px-8 py-6 rounded-full" style={{ backgroundColor: '#6f1d1b' }}>
                Get Started Today
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-2 px-8 py-6 rounded-full" style={{ borderColor: '#bb9457', color: '#6f1d1b' }}>
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;