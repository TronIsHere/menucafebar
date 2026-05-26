import type { Order } from "@/lib/orders/lifecycle";

export type TableFloorStatus = "free" | "ordering" | "ready" | "awaiting_payment";

export interface TableFloorState {
  number: string;
  status: TableFloorStatus;
  order?: Order;
}

export function getActiveTableOrder(
  tableNumber: string,
  orders: Order[]
): Order | undefined {
  return orders.find(
    (o) =>
      o.tableNumber === tableNumber &&
      !o.isPaid &&
      o.status !== "cancelled" &&
      o.status !== "completed"
  );
}

export function getUnpaidTableOrder(
  tableNumber: string,
  unpaidOrders: Order[]
): Order | undefined {
  return unpaidOrders.find((o) => o.tableNumber === tableNumber);
}

export function getTableFloorStatus(
  tableNumber: string,
  orders: Order[],
  unpaidOrders: Order[] = []
): TableFloorState {
  const order = getActiveTableOrder(tableNumber, orders);
  if (order) {
    if (order.status === "ready") {
      return { number: tableNumber, status: "ready", order };
    }
    return { number: tableNumber, status: "ordering", order };
  }

  const unpaid = getUnpaidTableOrder(tableNumber, unpaidOrders);
  if (unpaid) {
    return { number: tableNumber, status: "awaiting_payment", order: unpaid };
  }

  return { number: tableNumber, status: "free" };
}

export function buildFloorStates(
  tableNumbers: string[],
  orders: Order[],
  unpaidOrders: Order[] = []
): TableFloorState[] {
  return tableNumbers.map((number) =>
    getTableFloorStatus(number, orders, unpaidOrders)
  );
}

export function countFloorStatuses(states: TableFloorState[]) {
  return states.reduce(
    (acc, s) => {
      acc[s.status]++;
      return acc;
    },
    { free: 0, ordering: 0, ready: 0, awaiting_payment: 0 } as Record<
      TableFloorStatus,
      number
    >
  );
}
