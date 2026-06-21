import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  image: { type: String, trim: true }
}, { timestamps: true, versionKey: false });

userSchema.set("toJSON", {
  transform: (_document, returned: Record<string, unknown>) => {
    returned.id = String(returned._id);
    delete returned._id;
    delete returned.passwordHash;
  }
});
export const User = model("User", userSchema);
