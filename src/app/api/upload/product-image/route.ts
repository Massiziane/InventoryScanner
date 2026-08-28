import { BlobServiceClient } from "@azure/storage-blob";

const connectionString =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName =
  process.env.AZURE_STORAGE_CONTAINER ?? "product-images";

export async function POST(request: Request) {
  try {
    if (!connectionString) {
      return Response.json(
        {
          error:
            "Azure Storage connection string is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          error: "Image file is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        {
          error: "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const blobName =
      `products/${crypto.randomUUID()}.${extension}`;

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(
        connectionString
      );

    const containerClient =
      blobServiceClient.getContainerClient(
        containerName
      );

    await containerClient.createIfNotExists();

    const blockBlobClient =
      containerClient.getBlockBlobClient(
        blobName
      );

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    await blockBlobClient.uploadData(
      buffer,
      {
        blobHTTPHeaders: {
          blobContentType:
            file.type,
        },
      }
    );

    return Response.json({
      url: blockBlobClient.url,
    });
  } catch (error) {
    console.error(
      "AZURE PRODUCT IMAGE UPLOAD ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}