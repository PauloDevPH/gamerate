# 🎮 GameRate — Sistema de Avaliação de Jogos

Projeto da **3ª Unidade de Web II**. Catálogo de jogos onde usuários cadastrados avaliam com **estrelas (1–5)** e comentários.

🔗 **Aplicação em produção (Vercel):** [https://gamerate-one.vercel.app](https://gamerate-one.vercel.app)

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | **Next.js 14** (App Router) + **TypeScript** |
| Banco de dados | **MongoDB Atlas** + **Mongoose** (conexão Singleton) |
| Autenticação | **NextAuth.js** (Credentials + sessão JWT) |
| Segurança | **bcryptjs** (hash de senhas) |
| Dados assíncronos / cache | **TanStack React Query** + `revalidatePath` do Next |
| Estado de UI | **Zustand** |
| Estilo / componentes | **Tailwind CSS** + componentes estilo **ShadCN/UI** (copy-paste) + lucide-react |
| Deploy | **Vercel** |

## Funcionalidades

- Listar jogos, buscar por nome e filtrar por nota mínima
- Página de detalhes (`/games/[id]`) com trailer, screenshots e avaliações
- Cadastro e login de usuários
- **CRUD de avaliações**: criar, ler, editar e excluir (só o dono altera a própria avaliação)
- Painel privado (`/dashboard`): minhas avaliações + cadastro de novos jogos

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (crie o arquivo .env.local na raiz)
# MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/gamerate?retryWrites=true&w=majority
# NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
# NEXTAUTH_URL=http://localhost:3000

# 3. (Opcional) Popular o banco com os 8 jogos + usuário de teste
npm run seed        # login de teste: demo@gamerate.com / 123456

# 4. Iniciar
npm run dev         # http://localhost:3000
```

### MongoDB Atlas — checklist
1. Crie um cluster gratuito (M0) e um usuário de banco (Database Access).
2. Em **Network Access**, adicione `0.0.0.0/0` (necessário para a Vercel, que não tem IP fixo).
3. Copie a connection string e troque `<password>` e o nome do banco (`/gamerate`).

## Deploy na Vercel

1. Suba o projeto para o GitHub (o `.gitignore` já exclui `.env.local`).
2. Na Vercel: **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, cadastre:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = URL final do projeto (ex.: `https://gamerate.vercel.app`)
4. **Deploy**. Depois rode `npm run seed` localmente (apontando para o mesmo Atlas) para popular os jogos.

> As variáveis ficam mascaradas no painel da Vercel e nunca vão para o repositório.

## Estrutura de pastas

```
src/
├─ app/                  # rotas (App Router)
│  ├─ (auth)/            # grupo: login e register (layout próprio)
│  ├─ api/               # API Routes: auth, register, games, reviews
│  ├─ dashboard/         # rota privada (layout próprio)
│  ├─ games/[id]/        # rota dinâmica + loading.tsx + error.tsx
│  ├─ layout.tsx · page.tsx · loading.tsx · error.tsx · not-found.tsx
├─ components/           # UI (ui/ = estilo ShadCN) e componentes do app
├─ lib/                  # mongodb (Singleton), auth, data, serializers, utils
├─ models/               # Mongoose: User, Game, Review
├─ store/                # Zustand (estado de UI)
├─ types/                # tipos TypeScript (DTOs, NextAuth)
└─ middleware.ts         # proteção de rotas na borda
```

Os comentários `[CRITÉRIO X.Y]` no código indicam onde cada item da avaliação foi implementado.
