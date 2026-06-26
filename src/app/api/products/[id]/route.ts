import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/schemas/product";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { scans: true },
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: result.data,
  });

  return Response.json(product);
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const { id } = await params;

  await prisma.product.delete({
    where: { id },
  });

  return Response.json({ success: true });
}