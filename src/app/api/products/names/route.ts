import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
    },
    distinct: ["name"],
    orderBy: {
      name: "asc",
    },
  });

  const names = products
    .map((product) => product.name.trim())
    .filter(Boolean);

  return Response.json(names);
}