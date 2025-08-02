import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getAuthHeader } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Hotel, 
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Users,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  User,
  Crown
} from 'lucide-react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export default function ManageUsers() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // For demo purposes, we'll show mock data since we don't have a real users endpoint
      const mockUsers: User[] = [
        {
          _id: 'admin-1',
          email: 'admin@hotel.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date('2023-01-15').toISOString()
        },
        {
          _id: 'customer-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          createdAt: new Date('2024-01-20').toISOString()
        },
        {
          _id: 'customer-2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'customer',
          createdAt: new Date('2024-02-10').toISOString()
        },
        {
          _id: 'customer-3',
          email: 'mike@example.com',
          firstName: 'Mike',
          lastName: 'Johnson',
          role: 'customer',
          createdAt: new Date('2024-03-05').toISOString()
        }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user?._id) {
      alert("You cannot delete your own account!");
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      // For demo purposes, just remove from local state
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert('User deleted successfully! (Demo mode)');
    }
  };

  const handleEditUser = (userId: string) => {
    alert(`Edit user functionality would open for user ID: ${userId} (Demo mode)`);
  };

  const handleAddUser = () => {
    alert('Add new user functionality - Coming Soon! (Demo mode)');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-white">Loading users...</div>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Users</h1>
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
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="h-6 w-6 mr-2" />
              User Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage hotel users and their permissions
            </p>
          </div>
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Filters */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-gray-900 dark:text-white">Search Users</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="roleFilter" className="text-gray-900 dark:text-white">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter !== 'all' 
                ? `Showing filtered results` 
                : 'All registered users'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || roleFilter !== 'all' ? 'No users match your filters' : 'No users found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userData) => (
                  <div 
                    key={userData._id} 
                    className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {userData.role === 'admin' ? (
                            <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.firstName} {userData.lastName}
                          </p>
                          <Badge 
                            variant={userData.role === 'admin' ? 'default' : 'secondary'}
                          >
                            {userData.role}
                          </Badge>
                          {userData._id === user?._id && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {userData.email}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(userData._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {userData._id !== user?._id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(userData._id)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
