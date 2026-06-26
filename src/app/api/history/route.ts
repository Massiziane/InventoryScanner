import { prisma } from "@/lib/prisma";

export async function GET() {
  const history = await prisma.scanLog.findMany({
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: true,
    },
  });

  return Response.json(JSON.parse(JSON.stringify(history)));
}