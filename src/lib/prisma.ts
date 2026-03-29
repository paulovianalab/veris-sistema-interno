import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  // Production / Cloud: Use Turso LibSQL adapter
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== 'undefined') {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSql(libsql as any);
    return new PrismaClient({ adapter } as any);
  }

  // Fallback seguro caso as variáveis do Turso não estejam no Vercel ainda
  if (process.env.NODE_ENV === 'production') {
     console.warn("⚠️ AVISO: Variáveis TURSO_DATABASE_URL ausentes no ambiente de produção Vercel.");
     // Retorna um cliente prisma padrão genérico que usa DATABASE_URL, se existir (ou falha com mensagem mais limpa)
     return new PrismaClient();
  }

  // Development only: Use local SQLite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  
  const dbPath = path.join(process.cwd(), "dev.db");
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(sqlite);
  return new PrismaClient({ adapter } as any);
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
