import { Schema, model } from "mongoose";

const colourStopSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 32 },
  hex: { type: String, required: true, match: /^#[0-9A-F]{6}$/ },
  position: { type: Number, required: true, min: 0, max: 100 },
  locked: { type: Boolean, default: false },
  order: { type: Number, required: true, min: 0, max: 5 }
}, { _id: true, versionKey: false });

const gradientSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  type: { type: String, enum: ["linear", "radial", "conic", "mesh"], required: true },
  angle: { type: Number, min: 0, max: 360, default: 90 },
  centreX: { type: Number, min: 0, max: 100, default: 50 },
  centreY: { type: Number, min: 0, max: 100, default: 50 },
  noise: { type: Number, min: 0, max: 100, default: 0 },
  blur: { type: Number, min: 0, max: 100, default: 0 },
  aspectRatio: { type: String, enum: ["16:9", "4:3", "1:1", "9:16", "custom"], default: "16:9" },
  customRatio: { type: String, maxlength: 20, default: "3:2" },
  stops: {
    type: [colourStopSchema],
    required: true,
    validate: [
      { validator: (value: unknown[]) => value.length >= 2, message: "At least two colour stops are required" },
      { validator: (value: unknown[]) => value.length <= 6, message: "At most six colour stops are allowed" }
    ]
  },
  tags: { type: [{ type: String, trim: true, maxlength: 24 }], default: [], validate: [(value: string[]) => value.length <= 12, "At most 12 tags"] },
  saveCount: { type: Number, min: 0, default: 0 }
}, { timestamps: true, versionKey: false });

gradientSchema.index({ project: 1, updatedAt: -1 });
gradientSchema.index({ owner: 1, updatedAt: -1 });
export const Gradient = model("Gradient", gradientSchema);
