import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "Image file is required." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Only image files are allowed." },
      { status: 400 }
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filename = `products/${crypto.randomUUID()}.${extension}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return Response.json({
    url: blob.url,
  });
}