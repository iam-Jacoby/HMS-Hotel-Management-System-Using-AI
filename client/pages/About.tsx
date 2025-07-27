import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Hotel, 
  Users, 
  Award, 
  MapPin,
  Star,
  Heart,
  Shield,
  Clock,
  ArrowLeft,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

export default function About() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <Hotel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">About Us</h1>
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
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Grandview Hotel</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Experience unparalleled luxury and hospitality in the heart of the city. 
            Where every moment becomes a cherished memory.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 1985, Grandview Hotel has been a beacon of luxury and excellence 
                  in the downtown business district for nearly four decades. What started as a 
                  vision to create an extraordinary hospitality experience has evolved into one 
                  of the city's most prestigious destinations.
                </p>
                <p>
                  Our commitment to exceptional service, attention to detail, and creating 
                  unforgettable experiences for our guests has earned us a 5-star rating and 
                  numerous industry accolades. Every corner of our hotel reflects our dedication 
                  to elegance, comfort, and sophistication.
                </p>
                <p>
                  Today, we continue to set the standard for luxury hospitality, combining 
                  timeless elegance with modern amenities to provide our guests with an 
                  unparalleled experience in the heart of the city.
                </p>
              </div>
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

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do and define who we are as a company
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We strive for perfection in every detail, ensuring every guest experience exceeds expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Honest, transparent, and ethical practices form the foundation of all our relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Hospitality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Genuine care and personalized service make every guest feel valued and welcomed.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Awards & Recognition</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Celebrating our commitment to excellence in hospitality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">5-Star Rating</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tourism Board</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Best City Hotel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Travel Awards 2023</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Excellence in Service</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Hospitality Guild</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sustainable Tourism</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Green Hotels Association</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Meet the passionate individuals behind our exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                  alt="General Manager"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Michael Chen</h3>
                <p className="text-blue-600 font-medium mb-2">General Manager</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  15+ years in luxury hospitality, passionate about creating exceptional guest experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150&h=150&fit=crop&crop=face" 
                  alt="Executive Chef"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sarah Williams</h3>
                <p className="text-blue-600 font-medium mb-2">Executive Chef</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Award-winning chef specializing in international cuisine and farm-to-table dining.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                  alt="Guest Relations Director"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">David Martinez</h3>
                <p className="text-blue-600 font-medium mb-2">Guest Relations Director</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dedicated to ensuring every guest feels valued and receives personalized attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Experience the Grandview Difference</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have made Grandview Hotel their home away from home.
          </p>
          <div className="space-x-4">
            <Link to="/">
              <Button size="lg" variant="secondary">
                Book Your Stay
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
