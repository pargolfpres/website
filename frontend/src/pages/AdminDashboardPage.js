import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Podcast, FileText, LogOut, Trash2, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [files, setFiles] = useState([]);
  const [newPodcast, setNewPodcast] = useState({ title: '', spotify_url: '', description: '', duration: '45:00' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('course-materials');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      loadPodcasts();
      loadFiles();
    }
  }, [navigate]);

  const loadPodcasts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/podcast/list`);
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Error loading podcasts:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/files`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleAddPodcast = () => {
    setPodcasts([...podcasts, { ...newPodcast, id: Date.now().toString() }]);
    setNewPodcast({ title: '', spotify_url: '', description: '', duration: '45:00' });
  };

  const handleRemovePodcast = (id) => {
    setPodcasts(podcasts.filter(p => p.id !== id));
  };

  const handleSavePodcasts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/podcast/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podcasts)
      });
      
      if (response.ok) {
        alert('Podcasts updated successfully!');
        loadPodcasts();
      }
    } catch (error) {
      alert('Error updating podcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folder', uploadFolder);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert(`File uploaded successfully! URL: ${data.url}`);
        setUploadFile(null);
        loadFiles();
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#6f1d1b' }}>Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your TKR Coaching website</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="podcasts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="podcasts">
              <Podcast size={16} className="mr-2" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="files">
              <Upload size={16} className="mr-2" />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText size={16} className="mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Podcast Management */}
          <TabsContent value="podcasts" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#6f1d1b' }}>Manage Podcast Episodes</h2>
                
                <div className="space-y-4 mb-6">
                  {podcasts.map((podcast, idx) => (
                    <div key={podcast.id} className="flex gap-4 items-start p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Episode Title"
                          value={podcast.title}
                          onChange={(e) => {
                            const updated = [...podcasts];
                            updated[idx].title = e.target.value;
                            setPodcasts(updated);
                          }}
                        />
                        <Input
                          placeholder="Spotify URL"
                          value={podcast.audio_url || podcast.spotify_url}
                          onChange={(e) => {
                            const updated = [...podcasts];
                            updated[idx].audio_url = e.target.value;
                            updated[idx].spotify_url = e.target.value;
                            setPodcasts(updated);
                          }}
                        />
                        <Textarea
                          placeholder="Description"
                          value={podcast.description}
                          onChange={(e) => {
                            const updated = [...podcasts];
                            updated[idx].description = e.target.value;
                            setPodcasts(updated);
                          }}
                        />
                      </div>
                      <Button variant="destructive" onClick={() => handleRemovePodcast(podcast.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Add New Episode</h3>
                  <div className="space-y-3">
                    <Input
                      placeholder="Episode Title"
                      value={newPodcast.title}
                      onChange={(e) => setNewPodcast({...newPodcast, title: e.target.value})}
                    />
                    <Input
                      placeholder="Spotify Episode URL"
                      value={newPodcast.spotify_url}
                      onChange={(e) => setNewPodcast({...newPodcast, spotify_url: e.target.value})}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newPodcast.description}
                      onChange={(e) => setNewPodcast({...newPodcast, description: e.target.value})}
                    />
                    <Button onClick={handleAddPodcast}>
                      <Plus size={16} className="mr-2" />
                      Add Episode
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleSavePodcasts}
                    disabled={loading}
                    style={{ backgroundColor: '#6f1d1b' }}
                    className="text-white"
                  >
                    {loading ? 'Saving...' : 'Save All Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload */}
          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#6f1d1b' }}>Upload Files to S3</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label>Select Folder</Label>
                    <select 
                      className="w-full p-2 border rounded mt-1"
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                    >
                      <option value="course-materials">Course Materials</option>
                      <option value="ebooks">eBooks</option>
                      <option value="templates">Templates</option>
                      <option value="images">Images</option>
                      <option value="videos">Videos</option>
                    </select>
                  </div>

                  <div>
                    <Label>Choose File</Label>
                    <Input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    onClick={handleFileUpload}
                    disabled={!uploadFile || loading}
                    style={{ backgroundColor: '#6f1d1b' }}
                    className="text-white"
                  >
                    {loading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Uploaded Files</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {files.map(file => (
                      <div key={file.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{file.filename}</p>
                          <p className="text-sm text-gray-600">{file.folder}</p>
                        </div>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Editor */}
          <TabsContent value="content" className="space-y-6">
            <ContentEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
