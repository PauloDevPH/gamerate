import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  game: Types.ObjectId;
  user?: Types.ObjectId; // opcional: avaliações antigas do seed não têm usuário
  author: string;
  rating: number; // 1 a 5 estrelas
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Regra de negócio: cada usuário avalia cada jogo UMA vez (depois pode editar).
// partialFilterExpression ignora as avaliações sem usuário (seed).
ReviewSchema.index({ game: 1, user: 1 }, { unique: true, partialFilterExpression: { user: { $type: "objectId" } } });

const Review: Model<IReview> = models.Review || model<IReview>("Review", ReviewSchema);
export default Review;
