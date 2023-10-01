import * as mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true, maxLength: 300 },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export type Category = mongoose.InferSchemaType<typeof categorySchema>;
export const Category = mongoose.model("Category", categorySchema);
