import { supabase } from '../lib/supabase';

const SUPPORT_EMAIL = 'support@itemista.com';
const SUPPORT_PHONE = '+92 300 1234567';
const DELIVERY_WINDOW = '3-5 business days';

const buildOrderItemsHtml = (items = []) => {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0; color:#1f2937;">${item.name || 'Product'}</td>
          <td style="padding:8px 0; color:#475569; text-align:center;">${item.quantity || 1}</td>
          <td style="padding:8px 0; color:#1f2937; text-align:right;">Rs. ${Number(item.price || 0).toLocaleString()}</td>
        </tr>
      `,
    )
    .join('');
};

export const sendOrderConfirmationEmail = async ({ order, customerEmail, customerName }) => {
  if (!customerEmail) return false;

  const itemsHtml = buildOrderItemsHtml(order?.items || []);

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#ec4899;color:white;padding:18px 22px;font-size:18px;font-weight:700;">Order Confirmation</div>
      <div style="padding:22px;">
        <p style="margin:0 0 10px;color:#0f172a;">Hi ${customerName || 'Customer'},</p>
        <p style="margin:0 0 16px;color:#334155;line-height:1.6;">
          Thank you for shopping with ItemIsta. Your order has been placed successfully.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:16px;">
          <p style="margin:0 0 8px;color:#0f172a;"><strong>Order ID:</strong> ${order?.id || '-'}</p>
          <p style="margin:0 0 8px;color:#0f172a;"><strong>Payment Method:</strong> ${order?.payment_method || '-'}</p>
          <p style="margin:0;color:#0f172a;"><strong>Estimated Delivery:</strong> ${DELIVERY_WINDOW}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 0;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Item</th>
              <th style="text-align:center;padding:8px 0;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Qty</th>
              <th style="text-align:right;padding:8px 0;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="margin:0 0 6px;color:#0f172a;"><strong>Total:</strong> Rs. ${Number(order?.total || 0).toLocaleString()}</p>
        <p style="margin:0;color:#64748b;line-height:1.6;">
          Need help? Contact us at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.
        </p>
      </div>
    </div>
  `;

  const text = [
    `Hi ${customerName || 'Customer'},`,
    'Your order has been placed successfully.',
    `Order ID: ${order?.id || '-'}`,
    `Payment Method: ${order?.payment_method || '-'}`,
    `Estimated Delivery: ${DELIVERY_WINDOW}`,
    `Total: Rs. ${Number(order?.total || 0).toLocaleString()}`,
    `Need help? ${SUPPORT_EMAIL} | ${SUPPORT_PHONE}`,
  ].join('\n');

  try {
    const { error } = await supabase.functions.invoke('send-order-confirmation', {
      body: {
        to: customerEmail,
        subject: `Order Confirmed - ${order?.id || 'ItemIsta'}`,
        html,
        text,
        orderId: order?.id,
      },
    });

    if (error) {
      console.error('Order email invoke error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Order email send failed:', error);
    return false;
  }
};
