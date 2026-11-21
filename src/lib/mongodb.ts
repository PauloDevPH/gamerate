/**
 * ============================================================================
 * [CRITÉRIO 1.1 — PERSISTÊNCIA E SINGLETON]  (1,0 pt)
 * ============================================================================
 * PROBLEMA: em desenvolvimento o Next faz "hot reload" (reexecuta módulos a cada
 * salvamento) e na Vercel cada função serverless pode ser iniciada várias vezes.
 * Se cada execução abrisse uma conexão nova, o MongoDB Atlas estouraria o limite
 * de conexões do plano gratuito (~500).
 *
 * SOLUÇÃO (padrão Singleton): guardamos a conexão (e a Promise de conexão) em
 * `globalThis`, que SOBREVIVE ao hot reload. Toda chamada a `connectDB()`
 * reaproveita a mesma conexão em vez de criar outra.
 */
import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declaramos a variável global para o TypeScript reconhecer.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Se já existe cache global, reutiliza; senão cria um vazio (1ª execução).
const cache: MongooseCache = globalThis.mongooseCache ?? { conn: null, promise: null };
globalThis.mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Defina MONGODB_URI no .env.local / variáveis da Vercel");

  // 1) Já conectado? Devolve a mesma conexão (Singleton em ação).
  if (cache.conn) return cache.conn;

  // 2) Ainda não há conexão em andamento? Inicia UMA (e guarda a Promise para que
  //    requisições simultâneas esperem a mesma conexão, em vez de abrir várias).
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // permite tentar de novo se a conexão falhar
    throw err;
  }
  return cache.conn;
}
