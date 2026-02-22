import { ShoppingCart, User } from "lucide-react";
import { PrintableReceipt } from "./printable_receipt";
import { cn } from "@/lib/utils";
import { OrderItemsList } from "./order_items_list";
import { OrderTotals } from "./order_totals";
import { CashPaymentModal } from "./cash_payment_modal";
import { PrintModal } from "./print_modal";
import { useOrderPanel } from "./use_order_panel";

export type PaymentMethod = "cash" | "transfer";

export default function OrderPanel() {
  const {
    cartProps: { items, updateQuantity, removeItem, clearCart, subtotal, tax, total },
    payment, setPayment,
    showPaymentModal, setShowPaymentModal,
    amountReceived, setAmountReceived,
    completedOrder, lastAmountReceived,
    showPrintModal, customerName, setCustomerName, 
    orderType, setOrderType,
    receiptRef,
    paymentOptions, changeAmount, canConfirmCash,
    finalizeOrder, handleConfirmClick,
    closePrintModal, handlePrint
  } = useOrderPanel();

  return (
    <aside className="flex h-screen w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <ShoppingCart size={18} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Orden Actual</h2>
        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
          {items.length}
        </span>
      </div>

      {/* Customer Name Input (Optional) */}
      <div className="px-4 py-2 border-b border-border bg-secondary/10">
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Nombre del Cliente (Opcional)"
            className="w-full h-8 pl-8 pr-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
      </div>

      {/* Order Type Selector */}
      <div className="px-4 py-3 border-b border-border bg-secondary/5">
        <div className="flex bg-secondary/30 rounded-lg p-1">
          {(['local', 'para-llevar', 'plataformas'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all",
                orderType === type 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type === 'local' ? 'Local' : type === 'para-llevar' ? 'Llevar' : 'Plataforma'}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <OrderItemsList 
        items={items} 
        updateQuantity={updateQuantity} 
        removeItem={removeItem} 
      />

      {/* Footer */}
      <OrderTotals
        subtotal={subtotal}
        tax={tax}
        total={total}
        payment={payment}
        setPayment={setPayment}
        paymentOptions={paymentOptions}
        clearCart={clearCart}
        handleConfirmClick={handleConfirmClick}
        itemsCount={items.length}
      />

      {/* Cash Payment Modal */}
      <CashPaymentModal
        show={showPaymentModal}
        setShow={setShowPaymentModal}
        total={total}
        amountReceived={amountReceived}
        setAmountReceived={setAmountReceived}
        canConfirmCash={canConfirmCash}
        changeAmount={changeAmount}
        finalizeOrder={finalizeOrder}
      />

      {/* Print Modal */}
      <PrintModal
        show={showPrintModal}
        closePrintModal={closePrintModal}
        handlePrint={handlePrint}
      />

      {/* Hidden Printable Receipt */}
      <div className="hidden">
        <PrintableReceipt ref={receiptRef} order={completedOrder} amountReceived={lastAmountReceived} />
      </div>
    </aside>
  );
}
