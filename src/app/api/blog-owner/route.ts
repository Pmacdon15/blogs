import { NextResponse } from "next/server";
import { isBlogOwner } from "@/lib/auth";

export async function GET() {
  try {
    const isOwner = await isBlogOwner();
    return NextResponse.json({ isOwner });
  } catch (error) {
    return NextResponse.json({ isOwner: false }, { status: 500 });
  }
}
