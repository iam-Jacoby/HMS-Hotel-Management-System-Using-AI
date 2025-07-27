export interface User {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  _id: string;
  roomNumber: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  price: number;
  amenities: string[];
  maxOccupancy: number;
  isAvailable: boolean;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  _id: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  room?: Room;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password'>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'customer';
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  availableRooms: number;
  totalRooms: number;
  recentBookings: Booking[];
  monthlyRevenue: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface RoomSearchQuery {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface UserProfile extends Omit<User, 'password'> {
  bookingHistory?: Booking[];
}
