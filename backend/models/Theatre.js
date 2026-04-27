import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: String,
  location: String,
});

export default mongoose.model("Theatre", theatreSchema);
