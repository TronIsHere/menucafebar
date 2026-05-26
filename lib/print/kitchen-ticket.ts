export interface KitchenTicketItem {
  name: string;
  quantity: number;
  note?: string;
}

export interface KitchenTicketOrder {
  _id: string;
  items: KitchenTicketItem[];
  tableNumber?: string;
  customerName?: string;
  note?: string;
  source: "customer" | "waiter";
  createdAt: string;
}

export type PaperWidth = "58" | "80";

export interface KitchenTicketOptions {
  cafeName: string;
  paperWidth: PaperWidth;
}

function formatTime(dateStr: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateStr));
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function buildKitchenTicketHtml(
  order: KitchenTicketOrder,
  options: KitchenTicketOptions
): string {
  const width = options.paperWidth === "58" ? "58mm" : "80mm";
  const orderId = order._id.slice(-4).toUpperCase();
  const sourceLabel = order.source === "waiter" ? "پیشخدمت" : "آنلاین";

  const itemsHtml = order.items
    .map((item) => {
      const note = item.note
        ? `<div class="item-note">↳ ${escapeHtml(item.note)}</div>`
        : "";
      return `
        <div class="item">
          <div class="item-row">
            <span class="qty">${item.quantity}×</span>
            <span class="name">${escapeHtml(item.name)}</span>
          </div>
          ${note}
        </div>`;
    })
    .join("");

  const tableHtml = order.tableNumber
    ? `<div class="highlight">میز ${escapeHtml(order.tableNumber)}</div>`
    : "";

  const customerHtml = order.customerName
    ? `<div>مشتری: ${escapeHtml(order.customerName)}</div>`
    : "";

  const orderNoteHtml = order.note
    ? `<div class="order-note">⚠ ${escapeHtml(order.note)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>سفارش #${orderId}</title>
  <style>
    @page {
      size: ${width} auto;
      margin: 2mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: ${width};
      max-width: ${width};
      font-family: Tahoma, Arial, sans-serif;
      font-size: ${options.paperWidth === "58" ? "11px" : "12px"};
      line-height: 1.4;
      color: #000;
      background: #fff;
      padding: 2mm;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .large { font-size: ${options.paperWidth === "58" ? "16px" : "18px"}; font-weight: bold; }
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    .divider-bold {
      border-top: 2px solid #000;
      margin: 8px 0;
    }
    .meta { font-size: 10px; color: #333; }
    .highlight {
      font-size: ${options.paperWidth === "58" ? "20px" : "24px"};
      font-weight: bold;
      text-align: center;
      margin: 8px 0;
      padding: 4px;
      border: 2px solid #000;
    }
    .item { margin-bottom: 6px; }
    .item-row { display: flex; gap: 6px; align-items: baseline; }
    .qty {
      font-weight: bold;
      font-size: ${options.paperWidth === "58" ? "14px" : "16px"};
      min-width: 2em;
    }
    .name { flex: 1; font-weight: bold; }
    .item-note {
      font-size: 10px;
      margin-right: 2em;
      margin-top: 2px;
    }
    .order-note {
      background: #000;
      color: #fff;
      padding: 4px 6px;
      margin-top: 8px;
      font-weight: bold;
    }
    .footer { text-align: center; font-size: 10px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="center bold large">${escapeHtml(options.cafeName)}</div>
  <div class="center meta">برگه آشپزخانه</div>
  <div class="divider-bold"></div>

  <div class="center large">#${orderId}</div>
  ${tableHtml}
  ${customerHtml}

  <div class="divider"></div>
  <div class="meta">
    ${formatDate(order.createdAt)} — ${formatTime(order.createdAt)}
    · ${sourceLabel}
  </div>
  <div class="divider"></div>

  ${itemsHtml}
  ${orderNoteHtml}

  <div class="divider-bold"></div>
  <div class="footer">MenuCafe</div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printKitchenTicket(
  order: KitchenTicketOrder,
  options: KitchenTicketOptions
): void {
  if (typeof window === "undefined") return;

  const html = buildKitchenTicketHtml(order, options);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.parentNode?.removeChild(iframe);
    }, 1000);
  };

  iframe.contentWindow?.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(cleanup, 10000);

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();
}
