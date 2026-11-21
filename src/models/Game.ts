import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IMedia {
  type: "image" | "video";
  url: string;
}
export interface IGame {
  _id: Types.ObjectId;
  title: string;
  cover: string;
  description: string;
  media: IMedia[];
  createdBy?: Types.ObjectId;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    description: { type: String, required: true },
    media: [{ type: { type: String, enum: ["image", "video"], required: true }, url: { type: String, required: true }, _id: false }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Game: Model<IGame> = models.Game || model<IGame>("Game", GameSchema);
export default Game;
