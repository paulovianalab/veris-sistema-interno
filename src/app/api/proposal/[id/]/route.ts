import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            name: true,
            company: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ success: false, error: "Proposta não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno no servidor" }, { status: 500 });
  }
}
