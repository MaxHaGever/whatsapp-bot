import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: { type: String },
  token: { type: String },
  wabaId: { type: String },
  phoneId: { type: String},
});

const Business = mongoose.model("Business", businessSchema);

export default Business;
