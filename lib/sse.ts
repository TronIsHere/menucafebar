// Simple in-process SSE channel per cafeId
// In production, replace with Redis pub/sub for multi-instance deployments

type Subscriber = (data: string) => void;

const subscribers = new Map<string, Set<Subscriber>>();
const orderSubscribers = new Map<string, Set<Subscriber>>();

export function subscribe(cafeId: string, cb: Subscriber): () => void {
  if (!subscribers.has(cafeId)) {
    subscribers.set(cafeId, new Set());
  }
  subscribers.get(cafeId)!.add(cb);
  return () => {
    subscribers.get(cafeId)?.delete(cb);
    if (subscribers.get(cafeId)?.size === 0) {
      subscribers.delete(cafeId);
    }
  };
}

export function publish(cafeId: string, data: unknown) {
  const subs = subscribers.get(cafeId);
  if (!subs) return;
  const payload = JSON.stringify(data);
  for (const cb of subs) {
    cb(payload);
  }
}

export function subscribeOrder(orderId: string, cb: Subscriber): () => void {
  if (!orderSubscribers.has(orderId)) {
    orderSubscribers.set(orderId, new Set());
  }
  orderSubscribers.get(orderId)!.add(cb);
  return () => {
    orderSubscribers.get(orderId)?.delete(cb);
    if (orderSubscribers.get(orderId)?.size === 0) {
      orderSubscribers.delete(orderId);
    }
  };
}

export function publishOrder(orderId: string, data: unknown) {
  const subs = orderSubscribers.get(orderId);
  if (!subs) return;
  const payload = JSON.stringify(data);
  for (const cb of subs) {
    cb(payload);
  }
}
