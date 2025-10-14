import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const PodcastPage = () => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      {/* Spotify Podcast Embed */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#6f1d1b' }}>Listen on Spotify</h2>
              <p className="text-gray-600 text-lg">
                Subscribe and listen to all episodes on your favorite podcast platform
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe 
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/show/5wZAKHnzkyAcfouRn4p7z2?utm_source=generator&theme=0" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="TKR Coaching Podcast on Spotify"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b" data-testid="podcast-filters">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredEpisodes.length} {filteredEpisodes.length === 1 ? 'episode' : 'episodes'}
            </p>
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger className="w-48" data-testid="season-filter">
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasons.map(season => (
                  <SelectItem key={season} value={season.toString()}>
                    Season {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-12" data-testid="podcast-episodes">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tkr-gold border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading episodes...</p>
            </div>
          ) : filteredEpisodes.length === 0 ? (
            <div className="text-center py-20">
              <Volume2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No episodes found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEpisodes.map((episode, index) => (
                <Card
                  key={episode.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                  data-testid={`episode-card-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                      <div className="relative bg-gray-200">
                        <img
                          src={episode.thumbnail}
                          alt={episode.title}
                          className="w-full h-48 md:h-full object-cover"
                          style={{ minHeight: '192px', display: 'block' }}
                          loading="lazy"
                          onError={(e) => {
                            console.error('Podcast image failed to load:', episode.thumbnail);
                            e.target.style.display = 'block';
                            e.target.style.minHeight = '192px';
                            e.target.style.backgroundColor = '#e5e7eb';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="lg"
                            className="rounded-full bg-white tkr-burgundy hover:bg-cream-light"
                            data-testid={`play-episode-${index}`}
                          >
                            <Play size={24} />
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm tkr-burgundy font-semibold">
                              Season {episode.season} • Episode {episode.episode}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={16} className="mr-1" />
                              {episode.duration}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">{episode.title}</h3>
                          <p className="text-gray-600">{episode.description}</p>
                        </div>

                        <div className="pt-2">
                          <audio
                            controls
                            className="w-full"
                            data-testid={`audio-player-${index}`}
                            preload="metadata"
                          >
                            <source src={episode.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
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
