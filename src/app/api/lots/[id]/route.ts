import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const location = String(body.location ?? "").trim();

  if (!name) {
    return Response.json(
      { error: "Lot name is required" },
      { status: 400 }
    );
  }

  const lot = await prisma.lot.update({
    where: { id },
    data: {
      name,
      location: location || null,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return Response.json(lot);
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const { id } = await params;

  await prisma.lot.delete({
    where: { id },
  });

  return Response.json({ success: true });
}