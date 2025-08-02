import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Hotel, 
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Plus,
  Save
} from 'lucide-react';

export default function AddRoom() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    maxOccupancy: '',
    description: '',
    amenities: '',
    imageUrl: ''
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.roomNumber || !formData.type || !formData.price || !formData.maxOccupancy) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const roomData = {
        roomNumber: formData.roomNumber,
        type: formData.type,
        price: parseFloat(formData.price),
        maxOccupancy: parseInt(formData.maxOccupancy),
        description: formData.description || `Comfortable ${formData.type} room with modern amenities`,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : ['WiFi', 'TV', 'Air Conditioning'],
        images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop'],
        isAvailable: true
      };

      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Room added successfully!');
        // Reset form
        setFormData({
          roomNumber: '',
          type: '',
          price: '',
          maxOccupancy: '',
          description: '',
          amenities: '',
          imageUrl: ''
        });
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Room</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Room
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Create a new room for your hotel inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 text-green-800 dark:border-green-800 dark:text-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber" className="text-gray-900 dark:text-white">Room Number *</Label>
                  <Input
                    id="roomNumber"
                    placeholder="e.g., 101, 201, 301"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-900 dark:text-white">Room Type *</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-900 dark:text-white">Price per Night *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 120"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOccupancy" className="text-gray-900 dark:text-white">Max Occupancy *</Label>
                  <Select 
                    value={formData.maxOccupancy}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, maxOccupancy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5 Guests</SelectItem>
                      <SelectItem value="6">6 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the room features and amenities..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities" className="text-gray-900 dark:text-white">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="WiFi, TV, Air Conditioning, Mini Bar (comma-separated)"
                  value={formData.amenities}
                  onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                  disabled={loading}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Leave empty for default amenities based on room type
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-gray-900 dark:text-white">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/room-image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  disabled={loading}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Leave empty to use default room image
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Adding Room...' : 'Add Room'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
