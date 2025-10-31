import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 🧍 Register new user
export async function createUser(req, res) {
  try {
    const data = req.body;

    // ✅ Validation
    const requiredFields = [
      "email",
      "password",
      "employeeId",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
      "department",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    // ✅ Check duplicates
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      employeeId: data.employeeId,
      phoneNumber: data.phoneNumber,
      address: data.address,
      department: data.department,
      password: hashedPassword,
      role: data.role || "employee",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "User creation failed", error: error.message });
  }
}

// 🔐 Login user
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // ✅ Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid password" });

    // ✅ Build token payload
    const payload = {
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      department: user.department,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}

// 🛡️ Role check helper
export function isAdmin(req) {
  return req.user && req.user.role === "admin";
}
