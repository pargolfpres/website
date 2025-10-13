import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Mail, Cookie } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="privacy-policy-page">
      {/* Header */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #6f1d1b 0%, #4a1312 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg opacity-90">Last Updated: October 13, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-700 leading-relaxed">
                  Todd K Roberson Coaching ("TKR Coaching", "we", "us", or "our") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                  our website and use our mobile application and services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Database size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>1. Information We Collect</h2>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Personal Information</h3>
                    <p className="text-gray-700 mb-4">When you register for an account, we collect:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Name and email address</li>
                      <li>Password (encrypted)</li>
                      <li>Payment information (processed securely through Stripe)</li>
                      <li>Profile information you choose to provide</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Usage Information</h3>
                    <p className="text-gray-700 mb-4">We automatically collect:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Course progress and completion data</li>
                      <li>Community posts and interactions</li>
                      <li>Device information and IP address</li>
                      <li>Browser type and operating system</li>
                      <li>Pages visited and time spent on our platform</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Cookies and Tracking</h3>
                    <p className="text-gray-700">We use cookies and similar tracking technologies to enhance your experience, 
                    remember your preferences, and analyze how you use our services.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Eye size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>2. How We Use Your Information</h2>
                    <p className="text-gray-700 mb-4">We use your information to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Provide and maintain our coaching services</li>
                      <li>Process your membership payments and subscriptions</li>
                      <li>Send you course updates, newsletters, and educational content</li>
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Improve and personalize your learning experience</li>
                      <li>Monitor and analyze usage patterns and trends</li>
                      <li>Detect and prevent fraud or unauthorized access</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Lock size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>3. Information Sharing and Disclosure</h2>
                    <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information with:</p>
                    
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Service Providers</h3>
                    <p className="text-gray-700 mb-4">Third-party companies that help us operate our platform:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Payment processing (Stripe)</li>
                      <li>Cloud hosting and storage (AWS S3)</li>
                      <li>Email delivery services</li>
                      <li>Analytics providers</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Legal Requirements</h3>
                    <p className="text-gray-700 mb-4">We may disclose your information if required by law or to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Comply with legal process or government requests</li>
                      <li>Enforce our Terms of Service</li>
                      <li>Protect our rights, property, or safety</li>
                      <li>Prevent fraud or security issues</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Business Transfers</h3>
                    <p className="text-gray-700">In the event of a merger, acquisition, or sale of assets, your information 
                    may be transferred to the acquiring entity.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>4. Data Security</h2>
                    <p className="text-gray-700 mb-4">
                      We implement appropriate technical and organizational security measures to protect your personal information, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                      <li>Encryption of data in transit (SSL/TLS)</li>
                      <li>Secure password storage (bcrypt hashing)</li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication</li>
                      <li>Secure cloud infrastructure</li>
                    </ul>
                    <p className="text-gray-700">
                      However, no method of transmission over the internet is 100% secure. While we strive to protect 
                      your information, we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>5. Your Privacy Rights</h2>
                <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@tkrcoaching.com" className="font-semibold hover:underline" style={{ color: '#6f1d1b' }}>
                    privacy@tkrcoaching.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Cookie Policy */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Cookie size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>6. Cookie Policy</h2>
                    <p className="text-gray-700 mb-4">We use the following types of cookies:</p>
                    
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Essential Cookies</h3>
                    <p className="text-gray-700 mb-4">Required for the website to function properly (authentication, security)</p>
                    
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Analytics Cookies</h3>
                    <p className="text-gray-700 mb-4">Help us understand how visitors use our website</p>
                    
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Marketing Cookies</h3>
                    <p className="text-gray-700 mb-4">Track your visit across websites to deliver targeted advertising</p>
                    
                    <p className="text-gray-700">You can control cookies through your browser settings. Note that disabling 
                    cookies may affect website functionality.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>7. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect 
                  personal information from children. If you believe we have collected information from a child, 
                  please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* International Users */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>8. International Data Transfers</h2>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your country of residence. 
                  These countries may have different data protection laws. By using our services, you consent to such transfers.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>9. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by 
                  posting the new policy on this page and updating the "Last Updated" date. Your continued use of our 
                  services after changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>10. Contact Us</h2>
                    <p className="text-gray-700 mb-4">If you have questions about this Privacy Policy, please contact us:</p>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Email:</strong> privacy@tkrcoaching.com</p>
                      <p><strong>Mail:</strong> TKR Coaching Privacy Team<br />123 Real Estate Blvd<br />Suite 100<br />Your City, ST 12345</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back to Home */}
            <div className="text-center pt-8">
              <Link to="/">
                <button className="text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity" 
                  style={{ backgroundColor: '#6f1d1b' }}>
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;