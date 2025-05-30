import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const assets = [
    { name: "Ação XYZ", price: 12.5 },
    { name: "Fundo AFC", price: 118.3 },
    { name: "Ação LNM", price: 1000.0 },
    { name: "Fundo LKY", price: 2.75 },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { name: asset.name },
      update: {},
      create: asset,
    });
  }

  console.log("Ativos inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
