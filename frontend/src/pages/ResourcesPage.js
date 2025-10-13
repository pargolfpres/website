import React, { useEffect, useState } from 'react';
import { Search, FileText, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/resources`)
      .then(res => {
        setResources(res.data);
        setFilteredResources(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resources:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.resource_type === typeFilter);
    }

    setFilteredResources(filtered);
  }, [searchTerm, typeFilter, resources]);

  const getResourceIcon = (type) => {
    const icons = {
      daily_tip: <FileText size={32} className="text-blue-800" />,
      ebook: <BookOpen size={32} className="text-blue-800" />,
      workbook: <FileText size={32} className="text-blue-800" />,
      article: <FileText size={32} className="text-blue-800" />,
      market_report: <FileText size={32} className="text-blue-800" />
    };
    return icons[type] || <FileText size={32} className="text-blue-800" />;
  };

  const getResourceTypeLabel = (type) => {
    const labels = {
      daily_tip: 'Daily Tip',
      ebook: 'eBook',
      workbook: 'Workbook',
      article: 'Article',
      market_report: 'Market Report'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-16" data-testid="resources-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources & Tools</h1>
            <p className="text-xl text-blue-100">
              eBooks, workbooks, templates, and daily tips to power your success
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b" data-testid="resources-filters">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="type-filter">
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily_tip">Daily Tips</SelectItem>
                <SelectItem value="ebook">eBooks</SelectItem>
                <SelectItem value="workbook">Workbooks</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="market_report">Market Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12" data-testid="resources-grid">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No resources found</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="hover:shadow-xl transition-shadow"
                    data-testid={`resource-card-${resource.id}`}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                          {getResourceIcon(resource.resource_type)}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {getResourceTypeLabel(resource.resource_type)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                      </div>

                      {resource.tier_required !== 'free' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-800 font-semibold">
                            🔒 {resource.tier_required.charAt(0).toUpperCase() + resource.tier_required.slice(1)} membership required
                          </p>
                        </div>
                      )}

                      <Button
                        className="w-full bg-blue-800 hover:bg-blue-900"
                        data-testid={`download-${resource.id}`}
                      >
                        {resource.download_url ? (
                          <>
                            <Download size={16} className="mr-2" />
                            Download
                          </>
                        ) : (
                          'View Details'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen size={48} className="mx-auto text-blue-800 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want Access to Premium Resources?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upgrade your membership to unlock exclusive eBooks, workbooks, templates, and advanced resources
          </p>
          <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-8 rounded-full">
            View Pricing Plans
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
