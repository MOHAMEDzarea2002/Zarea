const TELEGRAM_API = "https://api.telegram.org";

// نهرب الحروف اللي ممكن تكسر الـ HTML في رسالة تيليجرام (بيانات العميل بتتكتب بإيده)
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatOrderMessage = (order) => {
  const addr = order.shippingAddress || {};
  const shortId = order._id.toString().slice(-6).toUpperCase();

  const items = order.items
    .map(
      (item, i) =>
        `${i + 1}. ${escapeHtml(item.name)} | ${escapeHtml(item.size)} / ${escapeHtml(item.color)} × ${item.quantity} = ${item.price * item.quantity} ج.م`,
    )
    .join("\n");

  const lines = [
    "🛍 <b>طلب جديد</b>",
    `<b>رقم الطلب:</b> <code>${shortId}</code>`,
    "",
    `<b>العميل:</b> ${escapeHtml(addr.fullName)}`,
    `<b>التليفون:</b> ${escapeHtml(addr.phone)}`,
    `<b>المدينة:</b> ${escapeHtml(addr.city)}`,
    `<b>العنوان:</b> ${escapeHtml(addr.street)} - ${escapeHtml(addr.building)}`,
  ];

  if (addr.notes) lines.push(`<b>ملاحظات:</b> ${escapeHtml(addr.notes)}`);

  lines.push("", "<b>المنتجات:</b>", items, "");
  lines.push(`<b>الإجمالي:</b> ${order.totalPrice} ج.م`);
  lines.push(
    `<b>طريقة الدفع:</b> ${order.paymentMethod === "InstaPay" ? "InstaPay" : "الدفع عند الاستلام"}`,
  );

  if (order.paymentReference) {
    lines.push(`<b>رقم المرجع:</b> <code>${escapeHtml(order.paymentReference)}</code>`);
  }

  return lines.join("\n");
};

const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // لو مش متظبط، نتجاهل بهدوء
  if (!token || !chatId) return;

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(8000),
  });

  // ما نطبعش الـ token في الخطأ أبدًا
  if (!res.ok) throw new Error(`Telegram responded with status ${res.status}`);
};

const notifyNewOrder = (order) => sendTelegramMessage(formatOrderMessage(order));

module.exports = { notifyNewOrder };
