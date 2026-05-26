import { NextRequest, NextResponse } from "next/server";
import { getSession, getCafeForOwner } from "@/lib/session";
import { uploadMenuImage } from "@/lib/s3/upload";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const result = await uploadMenuImage(cafe._id.toString(), file);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status =
      message === "Invalid file type" || message === "File too large" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
