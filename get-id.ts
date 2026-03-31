import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const proposal = await prisma.proposal.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  console.log("Latest Proposal ID:", proposal?.id)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
