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
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function Index() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState<RoomSearchQuery>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop'
  ];

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }

    fetchRooms();
  }, [user, navigate]);

  useEffect(() => {
    // Rotate hero background images every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchRooms = async (query: RoomSearchQuery = {}) => {
    try {
      setError(''); // Clear previous errors
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/rooms?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Room[]> = await response.json();

      if (data.success && data.data) {
        setRooms(data.data);
      } else {
        setError(data.message || 'Failed to load rooms');
      }
    } catch (err) {
      console.error('Fetch rooms error:', err);
      if (err instanceof Error) {
        setError(`Failed to load rooms: ${err.message}`);
      } else {
        setError('Network error. Please try again.');
      }
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

  const handleOfferClick = (offerType: string) => {
    alert(`${offerType} offer details:\n\nFor more information and to book this special offer, please contact our reservations team at +1 (555) 123-4567 or visit our front desk.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Hotel className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Grandview Hotel
                </h1>
              </Link>
              <nav className="hidden md:flex ml-8 space-x-6">
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t dark:border-gray-700 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {isAuthenticated ? (
                  <>
                    <div className="border-t dark:border-gray-700 pt-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 px-2 mb-2">
                        Welcome, {user?.firstName}
                      </p>
                      <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          My Bookings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hotel Background ${index + 1}`}
              className="w-full h-full object-cover filter blur-sm"
            />
          </div>
        ))}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-5"></div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to Grandview Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
            Experience luxury and comfort in the heart of the city
          </p>
          <div className="flex items-center justify-center text-lg mb-8 drop-shadow-md">
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

        {/* Special Offers Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Exclusive deals and packages for your perfect getaway</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Weekend Getaway</h3>
                <p className="text-purple-100">Save 25% on weekend stays</p>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Perfect for romantic escapes and city breaks. Includes complimentary breakfast and late checkout.
                </p>
                <Button variant="outline" className="w-full" onClick={() => handleOfferClick('Weekend Getaway')}>Learn More</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Business Traveler</h3>
                <p className="text-green-100">Extended stay discounts</p>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Stay 5+ nights and save up to 30%. Includes free WiFi, parking, and meeting room access.
                </p>
                <Button variant="outline" className="w-full" onClick={() => handleOfferClick('Business Traveler')}>Learn More</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Early Bird Special</h3>
                <p className="text-orange-100">Book 30 days ahead</p>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Plan ahead and save 20% on your stay. Non-refundable rates with the best guaranteed prices.
                </p>
                <Button variant="outline" className="w-full" onClick={() => handleOfferClick('Early Bird Special')}>Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16 py-16 bg-white dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Grandview Hotel</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Since 1985, Grandview Hotel has been the epitome of luxury and hospitality in the downtown business district.
                Our commitment to excellence and attention to detail ensures every guest enjoys an unforgettable experience.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                With 150 elegantly appointed rooms and suites, world-class dining, and exceptional service,
                we continue to set the standard for luxury hospitality in the heart of the city.
              </p>
              <Link to="/about">
                <Button>Learn More About Us</Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop"
                alt="Hotel Lobby"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Guests Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Real experiences from our valued guests</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Exceptional service and luxurious accommodations. The staff went above and beyond to make our anniversary special.
                  We'll definitely be returning!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b587?w=50&h=50&fit=crop&crop=face"
                    alt="Sarah M."
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Sarah M.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Verified Guest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Perfect location for business travelers. The meeting facilities are top-notch and the concierge service
                  helped arrange everything seamlessly."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                    alt="Michael R."
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Michael R.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Business Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "The suite was absolutely stunning with breathtaking city views. The restaurant exceeded our expectations.
                  Five-star experience all around!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                    alt="David L."
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">David L.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Leisure Guest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

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
            © 2025 Grandview Hotel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
