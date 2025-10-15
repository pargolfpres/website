import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EditableText from '@/components/EditableText';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const PodcastPage = () => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [podcastLabels, setPodcastLabels] = useState({
    page_title: 'Latest Episodes',
    page_subtitle: 'Listen to our podcast episodes on Spotify',
    episode1_label: 'Latest Episode',
    episode2_label: 'Previous Episode'
  });

  useEffect(() => {
    // Fetch podcast labels
    axios.get(`${API_URL}/content/podcast_labels`)
      .then(res => {
        if (res.data.data && Object.keys(res.data.data).length > 0) {
          setPodcastLabels(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching labels:', err));

    // Fetch episodes
    axios.get(`${API_URL}/podcast/episodes`)
      .then(res => {
        setEpisodes(res.data);
        setFilteredEpisodes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching episodes:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (seasonFilter === 'all') {
      setFilteredEpisodes(episodes);
    } else {
      setFilteredEpisodes(episodes.filter(ep => ep.season === parseInt(seasonFilter)));
    }
  }, [seasonFilter, episodes]);

  const seasons = [...new Set(episodes.map(ep => ep.season))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-tkr-burgundy to-tkr-dark-burgundy text-white py-20" data-testid="podcast-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Volume2 size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">TKR Coaching Podcast</h1>
            <p className="text-xl text-cream mb-6">
              Real strategies, real results, real conversations with top-producing agents
            </p>
            <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-semibold">
              FREE • All Episodes Available to Everyone
            </div>
          </div>
        </div>
      </section>

      {/* Spotify Podcast Embeds */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <EditableText
                as="h2"
                section="podcast_labels"
                field="page_title"
                className="text-3xl font-bold mb-4"
                style={{ color: '#6f1d1b' }}
              >
                {podcastLabels.page_title}
              </EditableText>
              <EditableText
                as="p"
                section="podcast_labels"
                field="page_subtitle"
                className="text-gray-600 text-lg"
              >
                {podcastLabels.page_subtitle}
              </EditableText>
            </div>
            
            {/* Episode 1 */}
            <div className="mb-8">
              <EditableText
                as="h3"
                section="podcast_labels"
                field="episode1_label"
                className="text-xl font-semibold mb-3"
                style={{ color: '#6f1d1b' }}
              >
                {podcastLabels.episode1_label}
              </EditableText>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe 
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/episode/06cL7lL5z9235PgbiyoXN0?utm_source=generator&theme=0" 
                  width="100%" 
                  height="232" 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  title="Latest TKR Coaching Podcast Episode"
                ></iframe>
              </div>
            </div>

            {/* Episode 2 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#6f1d1b' }}>Previous Episode</h3>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe 
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/episode/0wVNnRnLdRhtZ1mX3znpeg?utm_source=generator&theme=0" 
                  width="100%" 
                  height="232" 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  title="Previous TKR Coaching Podcast Episode"
                ></iframe>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="https://open.spotify.com/show/5wZAKHnzkyAcfouRn4p7z2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1DB954' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                View All Episodes on Spotify
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cream-light" data-testid="podcast-cta">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp size={48} className="mx-auto tkr-burgundy mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want More Than Just Podcasts?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get access to expert-led courses, daily tips, live coaching, and a thriving community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-tkr-burgundy hover:opacity-90 text-white px-8 rounded-full">
              Explore Courses
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-tkr-gold tkr-burgundy hover:bg-cream-light px-8 rounded-full"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPage;
