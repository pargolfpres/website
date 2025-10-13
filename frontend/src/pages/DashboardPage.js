import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, Download, Award, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('tkr_token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        return Promise.all([
          axios.get(`${API_URL}/courses`),
          axios.get(`${API_URL}/podcast/episodes`),
          axios.get(`${API_URL}/community/posts`)
        ]);
      })
      .then(([coursesRes, podcastsRes, postsRes]) => {
        setCourses(coursesRes.data.slice(0, 3));
        setPodcasts(podcastsRes.data.slice(0, 3));
        setCommunityPosts(postsRes.data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('tkr_token');
          navigate('/login');
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getTierColor = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-blue-100 text-blue-800',
      gold: 'bg-amber-100 text-amber-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" data-testid="dashboard-page">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey and achieve your goals</p>
        </div>

        {/* Membership Status */}
        <Card className="mb-8 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-blue-200 mb-1">Current Plan</p>
                <div className="flex items-center space-x-3">
                  <h2 className="text-3xl font-bold capitalize">{user?.membership_tier}</h2>
                  {user?.membership_tier === 'free' && (
                    <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                      Upgrade Available
                    </span>
                  )}
                </div>
              </div>
              {user?.membership_tier === 'free' && (
                <Link to="/pricing">
                  <Button
                    size="lg"
                    className="bg-white text-blue-800 hover:bg-blue-50 rounded-full"
                    data-testid="upgrade-button"
                  >
                    <TrendingUp className="mr-2" size={20} />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen size={32} className="mx-auto text-blue-800 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Courses Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award size={32} className="mx-auto text-blue-800 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Certificates Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Play size={32} className="mx-auto text-blue-800 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{podcasts.length}</p>
              <p className="text-sm text-gray-600">Podcast Episodes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users size={32} className="mx-auto text-blue-800 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{communityPosts.length}</p>
              <p className="text-sm text-gray-600">Community Posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <Link to="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
                <Link to="/courses">
                  <Button className="bg-blue-800 hover:bg-blue-900">Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(course.tier)}`}>
                          {course.tier}
                        </span>
                      </div>
                      <Progress value={0} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">0% Complete</span>
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" variant="outline">Continue</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recent Podcast Episodes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Podcast Episodes</h2>
            <Link to="/podcast">
              <Button variant="outline">View All Episodes</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {podcasts.map((episode) => (
              <Card key={episode.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <p className="text-xs text-blue-800 font-semibold">
                      S{episode.season} • E{episode.episode} • {episode.duration}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{episode.title}</h3>
                    <Button size="sm" className="w-full" variant="outline">
                      <Play size={16} className="mr-2" />
                      Play Episode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Highlights */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Community Highlights</h2>
            <Link to="/community">
              <Button variant="outline">View Community</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-800 font-semibold">
                        {post.user_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{post.user_name}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>❤️ {post.likes_count} likes</span>
                        <span>💬 {post.replies_count} replies</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download Mobile App CTA */}
        <Card className="bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-blue-200">
          <CardContent className="p-8 text-center">
            <Download size={48} className="mx-auto text-blue-800 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get the Mobile App
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Access all your courses, podcasts, and community discussions on the go. 
              Download the TKR Coaching app for iOS or Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900 rounded-full">
                📱 Download on iOS
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-800 rounded-full">
                🤖 Get it on Android
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
