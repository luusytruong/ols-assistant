import prisma from "./src/lib/prisma";

async function main() {
  await prisma.customerSession.deleteMany({});
  console.log("✅ Customer sessions table cleared.");
  await prisma.conversation.deleteMany({});
  console.log("✅ Conversations table cleared.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
