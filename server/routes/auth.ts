import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@shared/api";

// In a real app, these would be stored in a database
let users: User[] = [
  {
    _id: "admin-1",
    email: "admin@hotel.com",
    password: bcrypt.hashSync("admin123", 10),
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "customer-1",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      } as AuthResponse);
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      } as AuthResponse);
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      } as AuthResponse);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    } as AuthResponse);
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = "customer" }: RegisterRequest = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      } as AuthResponse);
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      } as AuthResponse);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      _id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: userWithoutPassword
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    } as AuthResponse);
  }
};

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions"
      });
    }
    next();
  };
};

export const getProfile: RequestHandler = (req: any, res) => {
  const user = users.find(u => u._id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    data: userWithoutPassword
  });
};
