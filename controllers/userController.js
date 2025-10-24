import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export async function createUser(req, res) {
  try {
    const data = req.body;

    if (!data.email || !data.password || !data.employeeId || !data.address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      employeeId: data.employeeId,
      phoneNumber: data.phoneNumber,
      address: data.address,
      password: hashedPassword,
      role: data.role || "employee",
    });

    await user.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "User creation failed", error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid password" });

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      image: user.image,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "150h" });


    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}
export function isAdmin(req) {
	if (req.user == null) {
		return false;
	}
	if (req.user.role != "admin") {
		return false;
	}

	return true;
}
//add try catch for asy