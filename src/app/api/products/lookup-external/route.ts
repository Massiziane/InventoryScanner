import { lookupProductFromUpcItemDb } from "@/utils/upcitemdb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json(
      { error: "Barcode is required" },
      { status: 400 }
    );
  }

  try {
    const product = await lookupProductFromUpcItemDb(barcode);

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "External product lookup failed" },
      { status: 500 }
    );
  }
}