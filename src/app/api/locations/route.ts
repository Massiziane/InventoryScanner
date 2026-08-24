import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      location: {
        not: null,
      },
    },
    select: {
      location: true,
    },
  });

  const locations = [
    ...new Set(
      products
        .map((product) => product.location?.trim())
        .filter((location): location is string => Boolean(location))
    ),
  ].sort((a, b) => a.localeCompare(b));

  return Response.json(locations);
}