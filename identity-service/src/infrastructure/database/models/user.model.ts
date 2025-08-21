import { Document, model, Schema } from "mongoose";
import { User } from "../../../domain/entities/user.entity";

export interface IUser extends Document , Omit<User, "id"> {}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  isBlocked: { type: Boolean, default: false },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  passwordHash: { type: String, required: true },
  roles: { type: [String], enum: ['user', 'professional', 'admin'], required: true },
}, { timestamps: true });

export const userModel = model<IUser>("User", userSchema);