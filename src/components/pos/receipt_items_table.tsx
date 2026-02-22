import React from "react";
import type { Order } from "@/context/orders_types";

interface Props {
  items: Order["items"];
}

export function ReceiptItemsTable({ items }: Props) {
  return (
    <div className="w-full mb-4">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-black">
            <th className="py-1 w-8">Cant</th>
            <th className="py-1">Artículo</th>
            <th className="py-1 text-right">Importe</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemTotal = (item.basePrice + item.customizations.reduce((s, c) => s + c.price, 0)) * item.quantity;
            return (
              <React.Fragment key={item.cartId}>
                <tr>
                  <td className="py-1 font-bold align-top">{item.quantity}</td>
                  <td className="py-1 pr-1 font-bold leading-tight">{item.name}</td>
                  <td className="py-1 text-right align-top">${itemTotal.toFixed(2)}</td>
                </tr>
                {item.customizations.length > 0 && (
                  <tr>
                    <td></td>
                    <td colSpan={2} className="pb-1 text-[10px] text-gray-700">
                      {item.customizations.map(c => `• ${c.label}`).join(' ')}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
