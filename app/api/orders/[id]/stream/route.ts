import { NextRequest } from "next/server";
import { getOrderForCustomer } from "@/lib/orders/get-order-for-customer";
import { subscribeOrder } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cafeSlug = new URL(request.url).searchParams.get("cafeSlug");

  if (!cafeSlug) {
    return new Response("cafeSlug is required", { status: 400 });
  }

  const result = await getOrderForCustomer(id, cafeSlug);
  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        `data: ${JSON.stringify({ type: "connected", order: result.order })}\n\n`
      );

      const unsub = subscribeOrder(id, (data) => {
        controller.enqueue(`data: ${data}\n\n`);
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(`: heartbeat\n\n`);
      }, 30000);

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
