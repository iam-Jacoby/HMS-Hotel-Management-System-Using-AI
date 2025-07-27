import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Room, ApiResponse, RoomSearchQuery } from '@shared/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Hotel,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  Utensils,
  LogOut,
  Calendar,
  Star,
  Search,
  Sun,
  Moon
} from 'lucide-react';

export default function Index() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState<RoomSearchQuery>({});

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }

    fetchRooms();
  }, [user, navigate]);

  const fetchRooms = async (query: RoomSearchQuery = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/rooms?${params.toString()}`);
      const data: ApiResponse<Room[]> = await response.json();
      
      if (data.success && data.data) {
        setRooms(data.data);
      } else {
        setError(data.message || 'Failed to load rooms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchRooms(searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoomFeatures = (amenities: string[]) => {
    const iconMap: Record<string, any> = {
      'WiFi': Wifi,
      'Room Service': Utensils,
      'Mini Bar': Coffee,
    };

    return amenities.slice(0, 3).map((amenity, index) => {
      const Icon = iconMap[amenity] || Star;
      return (
        <div key={index} className="flex items-center text-sm text-gray-600">
          <Icon className="h-4 w-4 mr-1" />
          {amenity}
        </div>
      );
    });
  };

  const handleViewDetails = (room: Room) => {
    navigate(`/room/${room._id}`);
  };

  const handleBookNow = (room: Room) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${room._id}`);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Grandview Hotel</h1>
              <nav className="hidden md:flex ml-8 space-x-6">
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Contact
                </Link>
              </nav>
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

              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Welcome, {user?.firstName}
                  </span>
                  <Link to="/my-bookings">
                    <Button variant="outline" size="sm">
                      My Bookings
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Grandview Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Experience luxury and comfort in the heart of the city
          </p>
          <div className="flex items-center justify-center text-lg mb-8">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Downtown Business District • 5-Star Rating</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Find Your Perfect Room
            </CardTitle>
            <CardDescription>
              Search for available rooms that match your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={searchQuery.checkIn || ''}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={searchQuery.checkOut || ''}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <Select value={searchQuery.guests?.toString() || ''} onValueChange={(value) => setSearchQuery(prev => ({ ...prev, guests: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="6">6 Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={searchQuery.type || 'all'} onValueChange={(value) => setSearchQuery(prev => ({ ...prev, type: value === 'all' ? undefined : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Rooms
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Rooms</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg">Loading rooms...</div>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No rooms found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={room.images[0] || "/placeholder.svg"} 
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant={room.isAvailable ? "default" : "secondary"}>
                        {room.isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="capitalize">
                          {room.type} Room {room.roomNumber}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          Up to {room.maxOccupancy} guests
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${room.price}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {room.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      {getRoomFeatures(room.amenities)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewDetails(room)}
                      >
                        View Details
                      </Button>
                      {isAuthenticated && room.isAvailable ? (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleBookNow(room)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      ) : !isAuthenticated ? (
                        <Link to="/login" className="flex-1">
                          <Button size="sm" className="w-full">
                            Login to Book
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" disabled className="flex-1">
                          Not Available
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Grandview Hotel?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Experience the finest amenities and services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Free WiFi</h3>
              <p className="text-gray-600 dark:text-gray-300">High-speed internet access throughout the hotel</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Free Parking</h3>
              <p className="text-gray-600 dark:text-gray-300">Complimentary parking for all hotel guests</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Restaurant</h3>
              <p className="text-gray-600 dark:text-gray-300">Fine dining restaurant with international cuisine</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Hotel className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Grandview Hotel</span>
          </div>
          <p className="text-gray-400">
            © 2024 Grandview Hotel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
