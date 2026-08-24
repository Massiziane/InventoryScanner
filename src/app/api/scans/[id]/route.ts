import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;
  const body = await request.json();

  const quantity = Math.max(1, Number(body.quantity) || 1);
  const action = body.action;

  const existingScan = await prisma.scanLog.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!existingScan) {
    return Response.json(
      { error: "Scan not found" },
      { status: 404 }
    );
  }

  const allowedActions = [
    "ADD_STOCK",
    "REMOVE_STOCK",
    "SALE",
    "CHECK",
  ];

  if (!allowedActions.includes(action)) {
    return Response.json(
      { error: "Invalid scan action" },
      { status: 400 }
    );
  }

  const updatedScan = await prisma.scanLog.update({
    where: { id },
    data: {
      action,
      quantity,
    },
    include: {
      product: true,
    },
  });

  return Response.json(updatedScan);
}

export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  const scan = await prisma.scanLog.findUnique({
    where: { id },
  });

  if (!scan) {
    return Response.json(
      { error: "Scan not found" },
      { status: 404 }
    );
  }

  await prisma.scanLog.delete({
    where: { id },
  });

  return Response.json({
    success: true,
  });
}