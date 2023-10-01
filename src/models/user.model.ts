import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      maxLength: 100,
      unique: true,
    },
    name: { type: String, required: true, maxLength: 100 },
    hashed_password: { type: String, required: true, maxLength: 300 },
    verify: { type: Boolean, required: true, default: false },
    introdution: { type: String, required: false, maxLength: 1000 },
    image: { type: String, required: false, maxLength: 1000 },
    token: { type: String, required: false, maxLength: 1000 },
  },
  {
    timestamps: true,
  }
);

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);
