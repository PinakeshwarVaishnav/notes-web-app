import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, login using email and password",
      });
    }

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();
    console.log("new created user is", newUser);

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({
      error: "invalid user details, user doesn't exist",
    });
  }

  const ispasswordvalid = await bcrypt.compare(password, user.password);

  if (!ispasswordvalid) {
    return res.status(401).json({
      error: "invalid password",
    });
  }

  const token = jwt.sign(
    { userid: user._id, email: user.email },
    process.env.jwt_secret!,
    { expiresIn: "1h" },
  );

  console.log("token for logged in user is", token);
  return res.json({ token });
};
