import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  const { id, itemId } = await params;
  const body = await request.json();

  const quantity = Math.max(
    1,
    Number(body.quantity) || 1
  );

  const item = await prisma.lotItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
    include: {
      product: true,
    },
  });

  if (item.lotId !== id) {
    return Response.json(
      { error: "Lot item does not belong to this lot" },
      { status: 400 }
    );
  }

  return Response.json(item);
}

export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  const { id, itemId } = await params;

  const item = await prisma.lotItem.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item || item.lotId !== id) {
    return Response.json(
      { error: "Lot item not found" },
      { status: 404 }
    );
  }

  await prisma.lotItem.delete({
    where: {
      id: itemId,
    },
  });

  return Response.json({
    success: true,
  });
}