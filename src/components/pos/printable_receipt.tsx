import { forwardRef } from 'react';
import type { Order } from '@/context/orders_types';
import { ReceiptItemsTable } from './receipt_items_table';

interface Props {
  order: Order | null;
  amountReceived?: number;
}

export const PrintableReceipt = forwardRef<HTMLDivElement, Props>(({ order, amountReceived }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="bg-white text-black p-4 w-[300px] font-mono text-sm leading-tight mx-auto hidden print:block print:w-full print:p-0">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="font-black text-2xl uppercase tracking-tighter mb-1">Mr. Burger</h1>
        <p className="text-xs">Ticket de Venta</p>
        <p className="text-xs mt-1">
          {new Date(order.timestamp).toLocaleDateString('es-MX')} - {new Date(order.timestamp).toLocaleTimeString('es-MX')}
        </p>
        <p className="text-[10px] mt-1 italic">Atendido por: {order.cashierName || "Sistema"}</p>
        <p className="font-bold border-y border-dashed border-black py-1 mt-2 mb-2 text-lg">
          Ticket #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
        </p>
        {order.customerName && (
          <p className="text-sm font-black mb-2 uppercase border-b border-black pb-1">
            Cliente: {order.customerName}
          </p>
        )}
      </div>

      <ReceiptItemsTable items={order.items} />

      {/* Totals */}
      <div className="border-t border-black pt-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-black text-lg border-t border-dashed border-black pt-1 mt-1">
          <span>TOTAL:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mt-4 pt-2 border-t border-black text-xs space-y-1">
        <div className="flex justify-between">
          <span>Método de pago:</span>
          <span className="uppercase font-bold">{order.paymentMethod}</span>
        </div>
        
        {order.paymentMethod === 'cash' && amountReceived && (
          <>
            <div className="flex justify-between">
              <span>Recibido:</span>
              <span>${amountReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Cambio:</span>
              <span>${(amountReceived - order.total).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs font-bold space-y-1 pb-4">
        <p>¡Gracias por tu compra!</p>
        <p className="text-[10px] font-normal">mrburger.com</p>
      </div>
    </div>
  );
});

PrintableReceipt.displayName = 'printable_receipt';
