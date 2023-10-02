import * as mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema(
  {
    image: { type: String, required: false },
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    pronunciation: { type: String, required: false },
    example: { type: String, required: false },
    exampleMeaning: { type: String, required: false },
    level: { type: Number, required: true, default: 1 },
    isFavorite: { type: Boolean, required: true, default: false },
    isPopular: { type: Boolean, required: true, default: false },
    isLearned: { type: Boolean, required: true, default: false },
    rewriteNumber: { type: Number, required: true, default: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type Vocabulary = mongoose.InferSchemaType<typeof vocabularySchema>;
export const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);
