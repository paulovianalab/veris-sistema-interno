import prisma from '../src/lib/prisma';

async function main() {
  // Clear existing
  await prisma.task.deleteMany({});
  await prisma.client.deleteMany({});

  const client1 = await prisma.client.create({
    data: {
      name: "João Silva",
      company: "Alpha Comércio Ltda",
      type: "Ativo",
      responsible: "Ana Lima",
      monthlyValue: 3500,
      tags: JSON.stringify(["Consultoria", "Gestão"]),
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Maria Santos",
      company: "Beta Solutions",
      type: "Proposta",
      responsible: "Carlos Mendes",
      monthlyValue: 5000,
      tags: JSON.stringify(["Desenvolvimento"]),
    }
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Tech Corp",
      company: "Tech Corp",
      type: "Negociação",
      responsible: "João Silva",
      monthlyValue: 12000,
      tags: JSON.stringify(["Enterprise"]),
    }
  });

  const client4 = await prisma.client.create({
    data: {
      name: "Novo Lead",
      company: "Startup XYZ",
      type: "Lead",
      responsible: "Ana Lima",
      monthlyValue: 0,
      tags: JSON.stringify([]),
    }
  });

  await prisma.task.create({
    data: {
      title: "Reunião de alinhamento",
      priority: "Alta",
      status: "Pendente",
      date: new Date(),
      clientId: client1.id,
      owner: "Ana Lima"
    }
  });

  await prisma.task.create({
    data: {
      title: "Enviar proposta comercial",
      priority: "Média",
      status: "Pendente",
      date: new Date(new Date().getTime() + 86400000), // tomorrow
      clientId: client2.id,
      owner: "Carlos Mendes"
    }
  });

  await prisma.proposal.deleteMany({});

  // ... (previous clients and tasks) ...

  await prisma.proposal.create({
    data: {
      title: "Estratégia de Social Media",
      status: "Aprovada",
      value: 5000,
      link: "https://www.adobe.com/support/products/enterprise/knowledgecenter/pdfs/v12/Acrobat_Reference.pdf",
      clientId: client1.id,
      date: new Date()
    }
  });

  await prisma.proposal.create({
    data: {
      title: "Redesign de Landing Page",
      status: "Enviada",
      value: 2500,
      link: "https://marketing-dashboard--paulovianalab.replit.app/",
      clientId: client2.id,
      date: new Date()
    }
  });

  await prisma.proposal.create({
    data: {
      title: "Campanha Google Ads",
      status: "Recusada",
      value: 3200,
      link: "#",
      clientId: client3.id,
      date: new Date()
    }
  });

  console.log("Database seeded with proposals!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
