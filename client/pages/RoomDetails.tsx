import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Room, ApiResponse } from '@shared/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Hotel,
  ArrowLeft,
  Users,
  Wifi,
  Coffee,
  Utensils,
  Car,
  Tv,
  Wind,
  Bath,
  Star,
  Calendar,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchRoom(id);
    }
  }, [id]);

  const fetchRoom = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      const data: ApiResponse<Room> = await response.json();
      
      if (data.success && data.data) {
        setRoom(data.data);
      } else {
        setError(data.message || 'Room not found');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, any> = {
      'WiFi': Wifi,
      'TV': Tv,
      'Air Conditioning': Wind,
      'Mini Bar': Coffee,
      'Room Service': Utensils,
      'Parking': Car,
      'Jacuzzi': Bath,
      'Balcony': Star,
      'Kitchen': Utensils,
    };

    const Icon = iconMap[amenity] || Star;
    return <Icon className="h-5 w-5" />;
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${room?._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading room details...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error || 'Room not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Rooms
              </Link>
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Room Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={room.images[0] || "/placeholder.svg"}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl capitalize">
                      {room.type} Room {room.roomNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Users className="h-4 w-4 mr-1" />
                      Up to {room.maxOccupancy} guests
                    </CardDescription>
                  </div>
                  <Badge variant={room.isAvailable ? "default" : "secondary"}>
                    {room.isAvailable ? "Available" : "Booked"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {room.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Room Amenities</CardTitle>
                <CardDescription>Everything you need for a comfortable stay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-blue-600">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Check-in/Check-out</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check-in: 3:00 PM</li>
                    <li>• Check-out: 11:00 AM</li>
                    <li>• Early check-in/late check-out available upon request</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Free cancellation up to 24 hours before check-in</li>
                    <li>• Cancellations within 24 hours are subject to a one-night charge</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">House Rules</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• No smoking in rooms</li>
                    <li>• Pets are not allowed</li>
                    <li>• Quiet hours: 10:00 PM - 7:00 AM</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-blue-600">${room.price}</div>
                  <div className="text-sm text-gray-500">per night</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium capitalize">{room.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maximum Occupancy:</span>
                    <span className="font-medium">{room.maxOccupancy} guests</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`font-medium ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {room.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {room.isAvailable ? (
                    <Button 
                      onClick={handleBookNow} 
                      className="w-full"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {isAuthenticated ? 'Book Now' : 'Login to Book'}
                    </Button>
                  ) : (
                    <Button disabled className="w-full" size="lg">
                      Not Available
                    </Button>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center">
                    Free cancellation • Instant confirmation
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Call us: +1 (555) 123-4567</p>
                    <p>Email: reservations@grandviewhotel.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
