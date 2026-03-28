"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "digitalveris@gmail.com" && password === "veris@digital!2026") {
    // 1 year expiration to 'remember always'
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const cookieStore = await cookies();
    cookieStore.set("veris_auth_token", "authenticated", {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    redirect("/");
  } else {
    return { error: "Credenciais inválidas. Tente novamente." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("veris_auth_token");
  redirect("/login");
}

export async function createProposalAction(formData: FormData) {
  const title = formData.get("title") as string;
  const clientId = formData.get("clientId") as string;
  const value = parseFloat((formData.get("value") as string) || "0");
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;

  await prisma.proposal.create({
    data: {
      title,
      clientId: clientId || null,
      value,
      status,
      link,
    },
  });

  revalidatePath("/propostas");
  return { success: true };
}

export async function updateProposalAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const clientId = formData.get("clientId") as string;
  const value = parseFloat((formData.get("value") as string) || "0");
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;

  await prisma.proposal.update({
    where: { id },
    data: {
      title,
      clientId: clientId || null,
      value,
      status,
      link,
    },
  });

  revalidatePath("/propostas");
  return { success: true };
}

export async function deleteProposalAction(id: string) {
  await prisma.proposal.delete({
    where: { id },
  });

  revalidatePath("/propostas");
  return { success: true };
}

// Client Actions
export async function createClientAction(formData: FormData) {
  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const type = formData.get("type") as string;
  const responsible = formData.get("responsible") as string;
  const monthlyValue = parseFloat((formData.get("monthlyValue") as string) || "0");
  const tagsStr = formData.get("tags") as string || "[]";

  await prisma.client.create({
    data: {
      name,
      company,
      type,
      responsible,
      monthlyValue,
      tags: tagsStr,
    },
  });

  revalidatePath("/clientes");
  revalidatePath("/");
  return { success: true };
}

export async function updateClientAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const type = formData.get("type") as string;
  const responsible = formData.get("responsible") as string;
  const monthlyValue = parseFloat((formData.get("monthlyValue") as string) || "0");
  const tagsStr = formData.get("tags") as string || "[]";

  await prisma.client.update({
    where: { id },
    data: {
      name,
      company,
      type,
      responsible,
      monthlyValue,
      tags: tagsStr,
    },
  });

  revalidatePath("/clientes");
  revalidatePath("/");
  return { success: true };
}

export async function deleteClientAction(id: string) {
  await prisma.client.delete({
    where: { id },
  });

  revalidatePath("/clientes");
  revalidatePath("/");
  return { success: true };
}

// Task Actions
export async function createTaskAction(formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const clientId = formData.get("clientId") as string;
  const owner = formData.get("owner") as string;

  await prisma.task.create({
    data: {
      title,
      priority,
      status,
      date,
      clientId: clientId || null,
      owner,
    },
  });

  revalidatePath("/tarefas");
  revalidatePath("/");
  return { success: true };
}

export async function updateTaskAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const clientId = formData.get("clientId") as string;
  const owner = formData.get("owner") as string;

  await prisma.task.update({
    where: { id },
    data: {
      title,
      priority,
      status,
      date,
      clientId: clientId || null,
      owner,
    },
  });

  revalidatePath("/tarefas");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTaskStatusAction(id: string, currentStatus: string) {
  const newStatus = currentStatus === "Pendente" ? "Concluída" : "Pendente";
  await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/tarefas");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTaskAction(id: string) {
  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/tarefas");
  revalidatePath("/");
  return { success: true };
}

// Note Actions
export async function createNoteAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const color = formData.get("color") as string;

  await prisma.note.create({
    data: { title, content, color },
  });

  revalidatePath("/notas");
  return { success: true };
}

export async function updateNoteAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const color = formData.get("color") as string;

  await prisma.note.update({
    where: { id },
    data: { title, content, color },
  });

  revalidatePath("/notas");
  return { success: true };
}

export async function deleteNoteAction(id: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath("/notas");
  return { success: true };
}

// Event Actions
export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);
  const type = formData.get("type") as string;

  await prisma.event.create({
    data: { title, description, date, type },
  });

  revalidatePath("/agenda");
  return { success: true };
}

export async function deleteEventAction(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/agenda");
  return { success: true };
}

// Global Settings Actions
export async function updateSettingsAction(formData: FormData) {
  const agencyName = formData.get("agencyName") as string;
  const theme = formData.get("theme") as string;

  await prisma.setting.upsert({
    where: { id: "global" },
    update: { agencyName, theme },
    create: { id: "global", agencyName, theme },
  });

  revalidatePath("/");
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function getSettings() {
  return await prisma.setting.findUnique({ where: { id: "global" } });
}
