import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: { type: String, required: false },
  token: { type: String, required: false },
  wabaId: { type: String, required: false },
  phoneId: { type: String, required: false },
});

const Business = mongoose.model("Business", businessSchema);

export default Business;
