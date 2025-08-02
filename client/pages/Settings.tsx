import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Hotel, 
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Settings as SettingsIcon,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Bell,
  Shield,
  Database
} from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Hotel Information Settings
  const [hotelSettings, setHotelSettings] = useState({
    name: 'Grandview Hotel',
    description: 'Experience unparalleled luxury and hospitality in the heart of the city.',
    address: '123 Downtown Business District, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@grandviewhotel.com',
    website: 'https://grandviewhotel.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD',
    taxRate: '10.5'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailCancellations: true,
    dailyReports: false,
    weeklyReports: true,
    systemAlerts: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    requireEmailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: '24',
    passwordExpiry: '90'
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Settings saved successfully!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2" />
            Hotel Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your hotel configuration and preferences
          </p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 text-green-800 dark:border-green-800 dark:text-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Information */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Hotel Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Basic information about your hotel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotelName" className="text-gray-900 dark:text-white">Hotel Name</Label>
                    <Input
                      id="hotelName"
                      value={hotelSettings.name}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-900 dark:text-white">Currency</Label>
                    <Input
                      id="currency"
                      value={hotelSettings.currency}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, currency: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={hotelSettings.description}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={hotelSettings.address}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900 dark:text-white flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={hotelSettings.phone}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 dark:text-white flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={hotelSettings.email}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-900 dark:text-white">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={hotelSettings.website}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operational Settings */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Operational Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Check-in times and financial settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn" className="text-gray-900 dark:text-white">Check-in Time</Label>
                    <Input
                      id="checkIn"
                      type="time"
                      value={hotelSettings.checkInTime}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, checkInTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut" className="text-gray-900 dark:text-white">Check-out Time</Label>
                    <Input
                      id="checkOut"
                      type="time"
                      value={hotelSettings.checkOutTime}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Tax Rate (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={hotelSettings.taxRate}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, taxRate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Email Bookings</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receive emails for new bookings
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailBookings}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailBookings: checked }))
                    }
                  />
                </div>

                <Separator className="dark:bg-gray-600" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Email Cancellations</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receive emails for cancellations
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailCancellations}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailCancellations: checked }))
                    }
                  />
                </div>

                <Separator className="dark:bg-gray-600" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Daily Reports</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receive daily summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, dailyReports: checked }))
                    }
                  />
                </div>

                <Separator className="dark:bg-gray-600" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Weekly Reports</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Security and access settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Email Verification</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Require email verification for new users
                    </p>
                  </div>
                  <Switch
                    checked={security.requireEmailVerification}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, requireEmailVerification: checked }))
                    }
                  />
                </div>

                <Separator className="dark:bg-gray-600" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-white">Two-Factor Auth</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Enable 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>

                <Separator className="dark:bg-gray-600" />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-gray-900 dark:text-white">
                    Session Timeout (hours)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>
                  <span className="text-gray-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Rooms:</span>
                  <span className="text-gray-900 dark:text-white">40</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Users:</span>
                  <span className="text-gray-900 dark:text-white">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
                  <span className="text-gray-900 dark:text-white">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={loading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </main>
    </div>
  );
}
