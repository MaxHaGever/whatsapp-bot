import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
});

const Business = mongoose.model("Business", businessSchema);

export default Business;
