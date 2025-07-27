import { useState, useEffect } from 'react';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { DashboardStats, ApiResponse } from '@shared/api';
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
  Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Hotel Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Room
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">All time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.availableRooms || 0}/{stats?.totalRooms || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((stats?.availableRooms || 0) / (stats?.totalRooms || 1)) * 100)}% available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Current month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings?.length ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Room {booking.room?.roomNumber} - {booking.room?.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                      </p>
                    </div>
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
                      <p className="text-sm font-medium">${booking.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent bookings found
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
