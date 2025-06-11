import { AuthenticatedRequest } from "./middleware/auth.middleware.js";
import TryCatch from "./middleware/TryCatch.js";
import { User } from "./Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  // Check valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  let user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  user = new User({ name, email, password: hashPassword });
  await user.save();
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );
  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if(!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY as string, { expiresIn: "7d"});

  res.status(200).json({message: "User logged in successfully", user, token});
  
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.status(200).json({ message: "User profile", user });
})