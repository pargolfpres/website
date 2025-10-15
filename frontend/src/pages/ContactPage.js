import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);
  const [contactInfo, setContactInfo] = React.useState({
    phone: '281-731-9454',
    email: 'info@toddkroberson.com',
    address: '110 Cypress Station Dr, Suite 105, Houston, TX 77090',
    hours: 'Monday - Friday, 9am - 5pm CST'
  });

  React.useEffect(() => {
    // Fetch contact info
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/content/contact_info`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Object.keys(data.data).length > 0) {
          setContactInfo(data.data);
        }
      })
      .catch(err => console.error('Error fetching contact info:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Thank you for your message! We\'ll get back to you soon.');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      alert('There was an error sending your message. Please try again or email us directly at info@toddkroberson.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="contact-page">
      {/* Header */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #6f1d1b 0%, #4a1312 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90">
              Have questions? We're here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#6f1d1b' }}>Send Us a Message</h2>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ focusRingColor: '#6f1d1b' }}
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-white py-6 rounded-full"
                      style={{ backgroundColor: '#6f1d1b' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#6f1d1b' }}>Get in Touch</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600">{contactInfo.phone}</p>
                        <p className="text-sm text-gray-500 mt-1">{contactInfo.hours}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin size={32} className="flex-shrink-0" style={{ color: '#6f1d1b' }} />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Office</h3>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: '#bb9457', backgroundColor: '#fff9e6' }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2" style={{ color: '#6f1d1b' }}>Need Immediate Help?</h3>
                    <p className="text-gray-700 mb-4">
                      Check out our Help Center for instant answers to common questions.
                    </p>
                    <Button variant="outline" className="border-2" style={{ borderColor: '#6f1d1b', color: '#6f1d1b' }}>
                      Visit Help Center
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center pb-12">
        <Link to="/">
          <Button className="text-white px-8 py-3 rounded-full" style={{ backgroundColor: '#6f1d1b' }}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;