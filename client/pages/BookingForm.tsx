import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Room, ApiResponse, BookingRequest } from '@shared/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Hotel,
  ArrowLeft,
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function BookingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchRoom(id);
    }
  }, [id, isAuthenticated, navigate]);

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

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    if (!room) return 0;
    return calculateNights() * room.price;
  };

  const validateForm = () => {
    if (!formData.checkInDate) return 'Please select a check-in date';
    if (!formData.checkOutDate) return 'Please select a check-out date';
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) return 'Check-in date cannot be in the past';
    if (checkOut <= checkIn) return 'Check-out date must be after check-in date';
    if (formData.numberOfGuests < 1) return 'Number of guests must be at least 1';
    if (room && formData.numberOfGuests > room.maxOccupancy) {
      return `This room can accommodate a maximum of ${room.maxOccupancy} guests`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const bookingData: BookingRequest = {
        roomId: id!,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests || undefined
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading booking form...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Room not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your reservation has been successfully created. You will be redirected to your bookings page shortly.
            </p>
            <Link to="/my-bookings">
              <Button>View My Bookings</Button>
            </Link>
          </CardContent>
        </Card>
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
              <Link to={`/room/${room._id}`} className="flex items-center mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Room Details
              </Link>
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Book Your Stay</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>
                  Please fill in your booking information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Guest Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Guest Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input value={user?.firstName} disabled />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input value={user?.lastName} disabled />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email} disabled />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Booking Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check-in Date *</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={formData.checkInDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, checkInDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">Check-out Date *</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={formData.checkOutDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                          min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="guests">Number of Guests *</Label>
                      <Select 
                        value={formData.numberOfGuests.toString()} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfGuests: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: room.maxOccupancy }, (_, i) => i + 1).map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} guest{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requirements or requests..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Info */}
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <img 
                    src={room.images[0] || "/placeholder.svg"}
                    alt={`Room ${room.roomNumber}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium capitalize">{room.type} Room {room.roomNumber}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-3 w-3 mr-1" />
                      Up to {room.maxOccupancy} guests
                    </div>
                  </div>
                </div>

                {/* Dates and Pricing */}
                <div className="space-y-3">
                  {formData.checkInDate && formData.checkOutDate && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Check-in:</span>
                        <span>{new Date(formData.checkInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Check-out:</span>
                        <span>{new Date(formData.checkOutDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Nights:</span>
                        <span>{calculateNights()}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Guests:</span>
                    <span>{formData.numberOfGuests}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                {calculateNights() > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">${room.price} × {calculateNights()} nights</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p>• Free cancellation up to 24 hours before check-in</p>
                  <p>• No prepayment needed</p>
                  <p>• Pay at the property</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
