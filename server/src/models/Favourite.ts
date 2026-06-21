import { Schema, model } from "mongoose";

const favouriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  target: { type: Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ["preset", "gradient"], required: true }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

favouriteSchema.index({ user: 1, targetType: 1, target: 1 }, { unique: true });
export const Favourite = model("Favourite", favouriteSchema);
