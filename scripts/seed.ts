/**
 * Popula o MongoDB Atlas com os 8 jogos do projeto original + 1 usuário de teste.
 * Uso:  npm run seed      (lê MONGODB_URI do .env.local)
 */
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/mongodb";
import Game from "../src/models/Game";
import Review from "../src/models/Review";
import User from "../src/models/User";

async function main() {
  const conn = await connectDB();
  const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "games-seed.json"), "utf8"));

  await Promise.all([Game.deleteMany({}), Review.deleteMany({})]);

  for (const g of seed) {
    const game = await Game.create({ title: g.title, cover: g.cover, description: g.description, media: g.media });
    for (const r of g.reviews) {
      await Review.create({ game: game._id, author: r.author, rating: r.rating, comment: r.comment, createdAt: new Date(r.createdAt) });
    }
  }

  if (!(await User.exists({ email: "demo@gamerate.com" }))) {
    await User.create({ name: "Usuário Demo", email: "demo@gamerate.com", password: await bcrypt.hash("123456", 10) });
  }

  console.log(`✔ ${seed.length} jogos importados. Login de teste: demo@gamerate.com / 123456`);
  await conn.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
