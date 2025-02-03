import mongoose, { Schema } from "mongoose";
import { hash } from "bcrypt";

interface UserInterface {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error while hashing password", error);
    return next(error as Error);
  }
});

export const User = mongoose.model<UserInterface>("User", UserSchema);
