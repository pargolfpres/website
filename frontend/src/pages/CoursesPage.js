import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/courses`)
      .then(res => {
        setCourses(res.data);
        setFilteredCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(course => course.tier === tierFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, categoryFilter, tierFilter, courses]);

  const getTierBadgeColor = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-blue-100 text-blue-800',
      gold: 'bg-amber-100 text-amber-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-16" data-testid="courses-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert-Led Courses</h1>
            <p className="text-xl text-blue-100">
              Master the skills that top agents use to dominate their markets
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b" data-testid="courses-filters">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="specialization">Specialization</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="tier-filter">
                <SelectValue placeholder="Membership Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12" data-testid="courses-grid">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No courses found matching your criteria</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                    data-testid={`course-card-${course.id}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTierBadgeColor(course.tier)}`}>
                          {course.tier}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen size={16} />
                          <span>{course.lesson_count} lessons</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Instructor:</strong> {course.instructor}
                        </p>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="w-full bg-blue-800 hover:bg-blue-900" data-testid={`view-course-${course.id}`}>
                            View Course
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50" data-testid="courses-cta">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award size={48} className="mx-auto text-blue-800 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want Access to ALL Courses?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upgrade to Silver or Gold membership to unlock the complete course library
          </p>
          <Link to="/pricing">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-8 rounded-full">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
