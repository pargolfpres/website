import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, Scale, CreditCard, Users, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="terms-of-service-page">
      {/* Header */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #6f1d1b 0%, #4a1312 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Scale size={48} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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
                  Welcome to Todd K Roberson Coaching ("TKR Coaching", "we", "us", or "our"). These Terms of Service 
                  ("Terms") govern your access to and use of our website, mobile application, and services. By accessing 
                  or using our services, you agree to be bound by these Terms.
                </p>
              </CardContent>
            </Card>

            {/* Acceptance */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <FileText size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>1. Acceptance of Terms</h2>
                    <p className="text-gray-700 mb-4">
                      By creating an account, accessing our website, or using our mobile application, you acknowledge that you have 
                      read, understood, and agree to be bound by these Terms and our Privacy Policy.
                    </p>
                    <p className="text-gray-700">
                      If you do not agree to these Terms, you must not use our services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>2. Eligibility</h2>
                <p className="text-gray-700 mb-4">To use our services, you must:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into a binding contract</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Account Registration */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Users size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>3. Account Registration and Security</h2>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Account Creation</h3>
                    <p className="text-gray-700 mb-4">
                      To access certain features, you must create an account. You agree to provide accurate, current, and complete 
                      information and to update your information as necessary.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Account Security</h3>
                    <p className="text-gray-700 mb-4">You are responsible for:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                      <li>Maintaining the confidentiality of your password</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying us immediately of any unauthorized access</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Account Termination</h3>
                    <p className="text-gray-700">
                      We reserve the right to suspend or terminate your account at any time for violations of these Terms, 
                      fraudulent activity, or for any other reason at our sole discretion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership and Payments */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <CreditCard size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>4. Membership Plans and Payments</h2>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Membership Tiers</h3>
                    <p className="text-gray-700 mb-4">TKR Coaching offers the following membership tiers:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li><strong>Bronze:</strong> $29/month or $290/year</li>
                      <li><strong>Silver:</strong> $79/month or $790/year</li>
                      <li><strong>Gold:</strong> $149/month or $1,490/year</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Billing</h3>
                    <p className="text-gray-700 mb-4">
                      Membership fees are billed in advance on a monthly or yearly basis. By subscribing, you authorize us to charge 
                      your payment method automatically until you cancel.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Refunds</h3>
                    <p className="text-gray-700 mb-4">
                      We offer a 30-day money-back guarantee for first-time subscribers. After 30 days, membership fees are 
                      non-refundable except as required by law.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Cancellation</h3>
                    <p className="text-gray-700 mb-4">
                      You may cancel your membership at any time from your account dashboard. Cancellation takes effect at the end 
                      of your current billing period. You will retain access until then.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Price Changes</h3>
                    <p className="text-gray-700">
                      We reserve the right to change our pricing at any time. We will provide at least 30 days' notice before any 
                      price increase takes effect for existing subscribers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content and Intellectual Property */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>5. Intellectual Property</h2>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Content</h3>
                    <p className="text-gray-700 mb-4">
                      All content on TKR Coaching, including courses, videos, podcasts, articles, templates, and materials 
                      ("Content") is owned by TKR Coaching or our licensors and is protected by copyright, trademark, and other laws.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">License to Use</h3>
                    <p className="text-gray-700 mb-4">
                      Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use our 
                      Content solely for your personal, non-commercial use.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Restrictions</h3>
                    <p className="text-gray-700 mb-4">You may NOT:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                      <li>Copy, reproduce, or distribute our Content</li>
                      <li>Modify, adapt, or create derivative works</li>
                      <li>Share your account credentials with others</li>
                      <li>Download, record, or screen capture courses (except where explicitly allowed)</li>
                      <li>Use our Content for commercial purposes</li>
                      <li>Remove copyright or proprietary notices</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">User Content</h3>
                    <p className="text-gray-700">
                      When you post content in our community (comments, forum posts, etc.), you grant us a worldwide, non-exclusive, 
                      royalty-free license to use, reproduce, and display that content in connection with our services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>6. Acceptable Use Policy</h2>
                    <p className="text-gray-700 mb-4">You agree NOT to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Violate any laws or regulations</li>
                      <li>Infringe on intellectual property rights</li>
                      <li>Post spam, offensive, or inappropriate content</li>
                      <li>Harass, threaten, or abuse other users</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Use automated tools (bots, scrapers) without permission</li>
                      <li>Interfere with the proper functioning of our services</li>
                      <li>Impersonate others or provide false information</li>
                      <li>Engage in fraudulent activities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>7. Disclaimers and Limitations</h2>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Educational Purpose</h3>
                <p className="text-gray-700 mb-4">
                  Our content is for educational and informational purposes only. It does not constitute professional advice. 
                  Results may vary, and we make no guarantees about your success.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">No Warranties</h3>
                <p className="text-gray-700 mb-4">
                  Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. 
                  We do not warrant that our services will be uninterrupted, error-free, or secure.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">Limitation of Liability</h3>
                <p className="text-gray-700">
                  To the maximum extent permitted by law, TKR Coaching shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising out of your use of our services.
                </p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>8. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless TKR Coaching, its officers, directors, employees, and agents from any 
                  claims, damages, losses, or expenses arising out of your use of our services, violation of these Terms, or 
                  infringement of any rights of another.
                </p>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>9. Dispute Resolution</h2>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], 
                  without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">Arbitration</h3>
                <p className="text-gray-700">
                  Any dispute arising out of these Terms shall be resolved through binding arbitration in accordance with the 
                  rules of the American Arbitration Association, except as otherwise provided by law.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>10. Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by email or through 
                  our platform. Your continued use of our services after changes take effect constitutes acceptance of the modified Terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#6f1d1b' }}>11. Contact Information</h2>
                <p className="text-gray-700 mb-4">If you have questions about these Terms, please contact us:</p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@tkrcoaching.com</p>
                  <p><strong>Mail:</strong> TKR Coaching Legal Department<br />123 Real Estate Blvd<br />Suite 100<br />Your City, ST 12345</p>
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

export default TermsOfServicePage;