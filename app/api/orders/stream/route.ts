import { NextRequest } from "next/server";
import { getSession, getCafeForOwner } from "@/lib/session";
import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cafe = await getCafeForOwner(session.user.id);
  if (!cafe) {
    return new Response("Cafe not found", { status: 404 });
  }

  const cafeId = cafe._id.toString();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

      const unsub = subscribe(cafeId, (data) => {
        controller.enqueue(`data: ${data}\n\n`);
      });

      // Heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(`: heartbeat\n\n`);
      }, 30000);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        unsub();
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
