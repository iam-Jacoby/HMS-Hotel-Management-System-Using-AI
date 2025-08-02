import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Hotel, 
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  Clock,
  Users,
  Star,
  Gift,
  Percent,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

export default function SpecialOffers() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
  };

  const offers = [
    {
      id: 1,
      title: "Weekend Getaway",
      discount: "25% OFF",
      validity: "Valid until March 31, 2025",
      description: "Perfect for romantic escapes and city breaks. Includes complimentary breakfast and late checkout.",
      features: [
        "25% discount on weekend stays (Friday-Sunday)",
        "Complimentary continental breakfast for 2",
        "Late checkout until 2:00 PM",
        "Welcome bottle of champagne",
        "Free parking",
        "Access to spa facilities"
      ],
      terms: [
        "Valid for bookings made by March 31, 2025",
        "Stay dates must be on weekends",
        "Minimum 2-night stay required",
        "Subject to availability",
        "Cannot be combined with other offers"
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      id: 2,
      title: "Business Traveler",
      discount: "30% OFF",
      validity: "Extended stay discounts",
      description: "Stay 5+ nights and save up to 30%. Includes free WiFi, parking, and meeting room access.",
      features: [
        "30% discount for stays of 5+ nights",
        "Free high-speed WiFi",
        "Complimentary parking",
        "Meeting room access (2 hours daily)",
        "Business center access",
        "Express laundry service",
        "Late checkout flexibility"
      ],
      terms: [
        "Minimum 5 consecutive nights required",
        "Valid for business travelers only",
        "Corporate ID may be required",
        "Advance booking recommended",
        "Excludes peak business periods"
      ],
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      id: 3,
      title: "Early Bird Special",
      discount: "20% OFF",
      validity: "Book 30 days in advance",
      description: "Plan ahead and save 20% on your stay. Non-refundable rates with the best guaranteed prices.",
      features: [
        "20% discount on all room types",
        "Best rate guarantee",
        "Priority room selection",
        "Complimentary room upgrade (subject to availability)",
        "Free WiFi and parking",
        "Early check-in when possible"
      ],
      terms: [
        "Must book 30+ days in advance",
        "Non-refundable booking",
        "Payment required at time of booking",
        "Changes not permitted",
        "Valid for stays through December 2025"
      ],
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Gift className="h-12 w-12 mr-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Special Offers</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Exclusive deals and packages for your perfect getaway at Grandview Hotel
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Offers Grid */}
        <div className="space-y-12">
          {offers.map((offer) => (
            <Card key={offer.id} className={`overflow-hidden ${offer.bgColor}`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className={`bg-gradient-to-r ${offer.color} text-white px-4 py-2 rounded-full mr-4`}>
                        <span className="font-bold text-lg">{offer.discount}</span>
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {offer.validity}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                      {offer.description}
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link to="/">
                      <Button size="lg" className="w-full md:w-auto">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {offer.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Terms */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Percent className="h-5 w-5 mr-2 text-blue-500" />
                      Terms & Conditions
                    </h3>
                    <ul className="space-y-2">
                      {offer.terms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>How to Book:</strong> Call our reservations team at +1 (555) 123-4567 and mention the offer code "{offer.title.toUpperCase().replace(/\s+/g, '')}" 
                    or book online and the discount will be automatically applied.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our reservations team is here to help you find the perfect offer for your stay.
          </p>
          <div className="space-x-4">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-800">
              Call +1 (555) 123-4567
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
