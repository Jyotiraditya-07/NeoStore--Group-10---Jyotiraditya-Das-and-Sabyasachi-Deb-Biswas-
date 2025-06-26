import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowecase: true,
    unique: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
