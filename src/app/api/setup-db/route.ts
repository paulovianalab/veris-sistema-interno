import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  // Debug: show what env vars we have
  if (!url) {
    return NextResponse.json({
      success: false,
      error: "TURSO_DATABASE_URL não está configurado neste projeto Vercel.",
      debug: {
        TURSO_DATABASE_URL: url ?? "undefined",
        TURSO_AUTH_TOKEN: token ? "***set***" : "undefined",
        NODE_ENV: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }

  try {
    const client = createClient({ url, authToken: token });

    await client.execute(`CREATE TABLE IF NOT EXISTS "Client" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "company" TEXT,
      "type" TEXT NOT NULL,
      "responsible" TEXT NOT NULL,
      "monthlyValue" REAL NOT NULL,
      "tags" TEXT NOT NULL DEFAULT '[]',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS "Task" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "priority" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "date" DATETIME NOT NULL,
      "clientId" TEXT,
      "owner" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("clientId") REFERENCES "Client"("id")
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS "Proposal" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "value" REAL NOT NULL,
      "link" TEXT,
      "clientId" TEXT,
      "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("clientId") REFERENCES "Client"("id")
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS "Note" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "color" TEXT NOT NULL DEFAULT 'bg-cyan-500',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "date" DATETIME NOT NULL,
      "type" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS "Setting" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global',
      "agencyName" TEXT NOT NULL DEFAULT 'Veris Digital',
      "theme" TEXT NOT NULL DEFAULT 'dark',
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    return NextResponse.json({
      success: true,
      message: "✅ Todas as tabelas criadas com sucesso no Turso!"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      debug: {
        TURSO_DATABASE_URL: url,
        TURSO_AUTH_TOKEN: token ? "***set***" : "undefined",
      }
    }, { status: 500 });
  }
}
