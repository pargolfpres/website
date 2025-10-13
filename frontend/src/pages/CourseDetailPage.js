import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Award, Play, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tkr_token');
    if (token) {
      axios.get(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => setUser(res.data))
        .catch(() => {});
    }

    axios.get(`${API_URL}/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        return axios.get(`${API_URL}/courses/${courseId}/lessons`);
      })
      .then(res => {
        setLessons(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching course:', err);
        toast.error('Course not found');
        setLoading(false);
      });
  }, [courseId]);

  const canAccessCourse = () => {
    if (!course || !user) return false;
    const tierLevels = { free: 0, bronze: 1, silver: 2, gold: 3 };
    return tierLevels[user.membership_tier] >= tierLevels[course.tier];
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/signup');
      return;
    }
    if (!canAccessCourse()) {
      navigate('/pricing');
      return;
    }
    toast.success('Enrolled successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tkr-gold border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTierBadgeColor = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-cream tkr-burgundy',
      gold: 'bg-gold-100 text-amber-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tkr-burgundy to-tkr-dark-burgundy text-white py-12" data-testid="course-detail-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/courses" className="inline-flex items-center opacity-80 hover:text-white mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTierBadgeColor(course.tier)}`}>
                  {course.tier}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="course-title">{course.title}</h1>
              <p className="text-xl text-cream">{course.description}</p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Clock size={20} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>{course.lesson_count} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={20} />
                  <span>Certificate included</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm opacity-80 mb-1">Instructor</p>
                <p className="text-lg font-semibold">{course.instructor}</p>
              </div>
            </div>

            <div className="lg:pl-8">
              <Card className="shadow-2xl">
                <CardContent className="p-6 space-y-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full rounded-lg"
                  />
                  
                  {user && canAccessCourse() ? (
                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleEnroll}
                      data-testid="enroll-button"
                    >
                      <Play className="mr-2" size={20} />
                      Start Learning
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="w-full bg-tkr-burgundy hover:opacity-90 text-white"
                        onClick={handleEnroll}
                        data-testid="enroll-button-locked"
                      >
                        {user ? (
                          <>
                            <Lock className="mr-2" size={20} />
                            Upgrade to Access
                          </>
                        ) : (
                          'Sign Up to Enroll'
                        )}
                      </Button>
                      {!user && (
                        <p className="text-sm text-gray-600 text-center">
                          Already have an account?{' '}
                          <Link to="/login" className="tkr-burgundy font-semibold hover:underline">
                            Log in
                          </Link>
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12" data-testid="course-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
          
          {lessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Course curriculum coming soon...</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {lessons.map((lesson, index) => (
                <AccordionItem
                  key={lesson.id}
                  value={`lesson-${index}`}
                  className="bg-white border-2 rounded-lg px-6"
                  data-testid={`lesson-${index}`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-4 text-left">
                      <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="tkr-burgundy font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-12 pt-4">
                    <p className="text-gray-600">{lesson.description}</p>
                    {lesson.video_url && user && canAccessCourse() && (
                      <Button className="mt-4" variant="outline">
                        <Play size={16} className="mr-2" />
                        Watch Lesson
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Related Courses CTA */}
      <section className="py-12 bg-cream-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Level Up?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore more courses to master every aspect of real estate success
          </p>
          <Link to="/courses">
            <Button size="lg" className="bg-tkr-burgundy hover:opacity-90 text-white px-8 rounded-full">
              Browse All Courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
