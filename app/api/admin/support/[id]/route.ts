import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { requireAdminSession } from "@/lib/session";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/support/constants";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  const ticket = await SupportTicket.findById(id).lean();

  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}

const updateSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  assignedTo: z.string().optional().nullable(),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { id } = await params;
  await connectDB();

  const updates: Record<string, unknown> = { ...result.data };
  if (result.data.status === "in_progress" && !result.data.assignedTo) {
    updates.assignedTo = session.user.id;
  }

  const ticket = await SupportTicket.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}
