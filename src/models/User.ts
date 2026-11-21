import { Schema, model, models, type Model, type Types } from "mongoose";

/** [CRITÉRIO 3.2 — Clean Architecture] Models isolados na pasta `models/`. */
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string; // sempre armazenada como HASH bcrypt (critério 2.3)
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false => a senha NUNCA vem em consultas comuns; só quando pedimos explicitamente (+password).
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// `models.User ||` evita "OverwriteModelError" no hot reload.
const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);
export default User;
