import { Document, model, Schema } from "mongoose";
import { User } from "../../../domain/entities/user.entity";

export interface IUser extends Document, Omit<User, "id"> {}

export const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profilePicture: { type: String },
    isBlocked: { type: Boolean, default: false },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    isRequestedForMentoring: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["user", "expert", "admin", "superadmin"],
      default: "user",
    },
  },
  { timestamps: true },
);
userSchema.index({ name: 1 });
userSchema.index({ email: 1 });

userSchema.index({ email: 1, role: 1 });

export const userModel = model<IUser>("User", userSchema);
