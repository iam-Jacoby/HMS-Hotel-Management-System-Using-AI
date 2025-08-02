import { useState, useEffect } from 'react';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { DashboardStats, ApiResponse, Booking } from '@shared/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Hotel,
  Users,
  Calendar,
  DollarSign,
  BedDouble,
  TrendingUp,
  LogOut,
  Plus,
  Settings,
  Sun,
  Moon,
  Check,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: getAuthHeader(),
      });
      const data: ApiResponse<DashboardStats> = await response.json();
      
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddRoom = () => {
    // Navigate to add room form or open modal
    alert('Add New Room functionality - Coming Soon!');
  };

  const handleManageUsers = () => {
    // Navigate to user management
    alert('Manage Users functionality - Coming Soon!');
  };

  const handleSettings = () => {
    // Navigate to settings
    alert('Settings functionality - Coming Soon!');
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardStats();
        alert('Booking confirmed successfully!');
      } else {
        alert('Failed to confirm booking');
      }
    } catch (error) {
      alert('Error confirming booking');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });

        if (response.ok) {
          // Refresh dashboard data
          fetchDashboardStats();
          alert('Booking deleted successfully!');
        } else {
          alert('Failed to delete booking');
        }
      } catch (error) {
        alert('Error deleting booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Hotel Management</h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddRoom}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Room
            </Button>
            <Button variant="outline" onClick={handleManageUsers}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalBookings || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.totalRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All time revenue</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Available Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.availableRooms || 0}/{stats?.totalRooms || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(((stats?.availableRooms || 0) / (stats?.totalRooms || 1)) * 100)}% available
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Current month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Bookings</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings?.length ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Room {booking.room?.roomNumber} - {booking.room?.type}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                            booking.status === 'cancelled' ? 'destructive' : 'outline'
                          }
                        >
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">${booking.totalAmount}</p>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {booking.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No recent bookings found
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
