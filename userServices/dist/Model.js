import mongoose, { Schema } from "mongoose";
;
const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    playlist: { type: [String], default: [] },
}, { timestamps: true });
export const User = mongoose.model("User", schema);
