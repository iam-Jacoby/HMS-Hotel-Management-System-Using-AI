import { RequestHandler } from "express";
import { Room, Booking, DashboardStats, RoomSearchQuery, BookingRequest, ApiResponse } from "@shared/api";

// Function to generate rooms for each type
const generateRooms = (): Room[] => {
  const roomTypes = [
    {
      type: "single",
      price: 120,
      amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar"],
      maxOccupancy: 1,
      description: "Comfortable single room perfect for solo travelers",
      images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop"],
      floor: 1
    },
    {
      type: "double",
      price: 180,
      amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service"],
      maxOccupancy: 2,
      description: "Spacious double room with modern amenities",
      images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop"],
      floor: 2
    },
    {
      type: "suite",
      price: 350,
      amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Jacuzzi", "Balcony"],
      maxOccupancy: 4,
      description: "Luxury suite with premium amenities and stunning views",
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop"],
      floor: 3
    },
    {
      type: "deluxe",
      price: 500,
      amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Jacuzzi", "Balcony", "Kitchen"],
      maxOccupancy: 6,
      description: "Premium deluxe room with all luxury amenities",
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&h=300&fit=crop"],
      floor: 4
    }
  ];

  const generatedRooms: Room[] = [];
  let roomIdCounter = 1;

  roomTypes.forEach((roomType) => {
    for (let i = 1; i <= 10; i++) {
      const roomNumber = `${roomType.floor}${i.toString().padStart(2, '0')}`;
      generatedRooms.push({
        _id: `room-${roomIdCounter}`,
        roomNumber,
        type: roomType.type,
        price: roomType.price,
        amenities: roomType.amenities,
        maxOccupancy: roomType.maxOccupancy,
        isAvailable: true,
        description: roomType.description,
        images: roomType.images,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      roomIdCounter++;
    }
  });

  // Mark the original room-4 (now room-37) as unavailable
  const room37 = generatedRooms.find(room => room._id === 'room-37');
  if (room37) {
    room37.isAvailable = false;
  }

  return generatedRooms;
};

// Sample hotel data - in a real app, this would be in a database
let rooms: Room[] = generateRooms();

let bookings: Booking[] = [
  {
    _id: "booking-1",
    userId: "customer-1",
    roomId: "room-4",
    checkInDate: new Date("2024-01-15"),
    checkOutDate: new Date("2024-01-20"),
    numberOfGuests: 2,
    totalAmount: 2500,
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getRooms: RequestHandler = (req, res) => {
  const query: RoomSearchQuery = req.query;
  
  let filteredRooms = rooms;

  if (query.type) {
    filteredRooms = filteredRooms.filter(room => room.type === query.type);
  }

  if (query.minPrice) {
    filteredRooms = filteredRooms.filter(room => room.price >= Number(query.minPrice));
  }

  if (query.maxPrice) {
    filteredRooms = filteredRooms.filter(room => room.price <= Number(query.maxPrice));
  }

  if (query.guests) {
    filteredRooms = filteredRooms.filter(room => room.maxOccupancy >= Number(query.guests));
  }

  // In a real app, we'd check availability against booking dates
  if (query.checkIn && query.checkOut) {
    // For now, just return available rooms
    filteredRooms = filteredRooms.filter(room => room.isAvailable);
  }

  res.json({
    success: true,
    data: filteredRooms
  } as ApiResponse<Room[]>);
};

export const getRoom: RequestHandler = (req, res) => {
  const room = rooms.find(r => r._id === req.params.id);
  
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found"
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: room
  } as ApiResponse<Room>);
};

export const createRoom: RequestHandler = (req, res) => {
  const roomData = req.body;
  
  const newRoom: Room = {
    _id: `room-${Date.now()}`,
    ...roomData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  rooms.push(newRoom);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: newRoom
  } as ApiResponse<Room>);
};

export const updateRoom: RequestHandler = (req, res) => {
  const roomIndex = rooms.findIndex(r => r._id === req.params.id);
  
  if (roomIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Room not found"
    } as ApiResponse);
  }

  rooms[roomIndex] = {
    ...rooms[roomIndex],
    ...req.body,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    message: "Room updated successfully",
    data: rooms[roomIndex]
  } as ApiResponse<Room>);
};

export const deleteRoom: RequestHandler = (req, res) => {
  const roomIndex = rooms.findIndex(r => r._id === req.params.id);
  
  if (roomIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Room not found"
    } as ApiResponse);
  }

  rooms.splice(roomIndex, 1);

  res.json({
    success: true,
    message: "Room deleted successfully"
  } as ApiResponse);
};

export const createBooking: RequestHandler = (req: any, res) => {
  const bookingData: BookingRequest = req.body;
  const userId = req.user.userId;

  const room = rooms.find(r => r._id === bookingData.roomId);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found"
    } as ApiResponse);
  }

  if (!room.isAvailable) {
    return res.status(400).json({
      success: false,
      message: "Room is not available"
    } as ApiResponse);
  }

  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * room.price;

  const newBooking: Booking = {
    _id: `booking-${Date.now()}`,
    userId,
    roomId: bookingData.roomId,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    numberOfGuests: bookingData.numberOfGuests,
    totalAmount,
    status: "pending",
    specialRequests: bookingData.specialRequests,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  bookings.push(newBooking);

  // Mark room as unavailable
  room.isAvailable = false;

  // Create a new room with the next available room number
  const createNextRoom = (bookedRoom: Room) => {
    const sameTypeRooms = rooms.filter(r => r.type === bookedRoom.type);
    const maxRoomNumber = Math.max(...sameTypeRooms.map(r => parseInt(r.roomNumber)));
    const nextRoomNumber = (maxRoomNumber + 1).toString();

    // Generate next room ID
    const maxRoomId = Math.max(...rooms.map(r => parseInt(r._id.replace('room-', ''))));
    const nextRoomId = `room-${maxRoomId + 1}`;

    const newRoom: Room = {
      _id: nextRoomId,
      roomNumber: nextRoomNumber,
      type: bookedRoom.type,
      price: bookedRoom.price,
      amenities: [...bookedRoom.amenities],
      maxOccupancy: bookedRoom.maxOccupancy,
      isAvailable: true,
      description: bookedRoom.description,
      images: [...bookedRoom.images],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    rooms.push(newRoom);
    return newRoom;
  };

  // Create the next available room
  const nextRoom = createNextRoom(room);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: newBooking
  } as ApiResponse<Booking>);
};

export const getBookings: RequestHandler = (req: any, res) => {
  let userBookings = bookings;

  // If not admin, only show user's own bookings
  if (req.user.role !== 'admin') {
    userBookings = bookings.filter(b => b.userId === req.user.userId);
  }

  // Populate with room and user data
  const populatedBookings = userBookings.map(booking => ({
    ...booking,
    room: rooms.find(r => r._id === booking.roomId)
  }));

  res.json({
    success: true,
    data: populatedBookings
  } as ApiResponse<Booking[]>);
};

export const getDashboardStats: RequestHandler = (req, res) => {
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const totalRooms = rooms.length;
  const recentBookings = bookings
    .slice(-5)
    .map(booking => ({
      ...booking,
      room: rooms.find(r => r._id === booking.roomId)
    }));

  // Calculate monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    })
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const stats: DashboardStats = {
    totalBookings,
    totalRevenue,
    availableRooms,
    totalRooms,
    recentBookings,
    monthlyRevenue
  };

  res.json({
    success: true,
    data: stats
  } as ApiResponse<DashboardStats>);
};
