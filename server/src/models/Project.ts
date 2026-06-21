import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, trim: true, maxlength: 600, default: "" },
  visibility: { type: String, enum: ["private", "public"], default: "private", index: true },
  tags: {
    type: [{ type: String, trim: true, maxlength: 24 }],
    validate: [(value: string[]) => value.length <= 12, "At most 12 tags are allowed"],
    default: []
  }
}, { timestamps: true, versionKey: false });

projectSchema.index({ owner: 1, updatedAt: -1 });
projectSchema.index({ visibility: 1, updatedAt: -1 });
export const Project = model("Project", projectSchema);
