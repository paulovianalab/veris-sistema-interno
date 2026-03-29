import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

const prismaClientSingleton = () => {
  // Configuração Oficial Turso + Vercel
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== 'undefined') {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql as any);
    return new PrismaClient({ adapter } as any);
  }

  // Fallback Vercel sem Variaveis definidas
  if (process.env.NODE_ENV === 'production') {
     return new PrismaClient();
  }

  // Development only: Use Prisma SQLite Native
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
