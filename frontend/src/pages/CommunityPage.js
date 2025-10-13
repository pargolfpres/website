import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/community/posts`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-20" data-testid="community-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">TKR Community</h1>
            <p className="text-xl text-blue-100 mb-6">
              Connect, learn, and grow with thousands of real estate professionals
            </p>
            <div className="inline-block bg-amber-500 text-white px-6 py-2 rounded-full font-semibold">
              🔒 Join our membership to participate
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">10,000+</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-600">Discussions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="text-sm text-gray-600">Daily Posts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Posts Preview */}
      <section className="py-12" data-testid="community-posts">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Discussions</h2>
            <p className="text-gray-600">Get a preview of what our community is talking about</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading discussions...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No discussions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-shadow relative"
                  data-testid={`community-post-${index}`}
                >
                  {/* Blur overlay for non-members */}
                  {index > 1 && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-900 font-semibold mb-2">🔒 Join to see full discussion</p>
                        <Link to="/pricing">
                          <Button size="sm" className="bg-blue-800 hover:bg-blue-900">
                            View Membership Plans
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {post.user_name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{post.user_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Heart size={16} />
                            <span>{post.likes_count} likes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle size={16} />
                            <span>{post.replies_count} replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-amber-50" data-testid="community-cta">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp size={48} className="mx-auto text-blue-800 mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get full access to our thriving community of real estate professionals. 
            Ask questions, share insights, and grow your network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-8 rounded-full">
                View Membership Plans
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-800 text-blue-800 hover:bg-blue-50 px-8 rounded-full"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
