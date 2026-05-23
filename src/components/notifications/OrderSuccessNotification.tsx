import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiNavigation, FiX } from "react-icons/fi";

interface OrderSuccessNotificationProps {
  show: boolean;
  onClose: () => void;
  orderId?: string;
  invoice?: string;
  total?: number;
  trackingId?: string;
  currency?: string;
}

const OrderSuccessNotification = ({
  show,
  onClose,
  orderId,
  invoice,
  total,
  trackingId,
  currency = "$",
}: OrderSuccessNotificationProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-border">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <FiX className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h2>
          {invoice && <p className="text-muted-foreground mb-1">Invoice: #{invoice}</p>}
          {total !== undefined && (
            <p className="text-lg font-semibold text-primary mb-4">{currency}{total.toFixed(2)}</p>
          )}
          <div className="flex gap-3 justify-center mt-6">
            {orderId && (
              <button
                onClick={() => { navigate(`/order/${orderId}`); onClose(); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <FiPackage className="w-4 h-4" /> View Order
              </button>
            )}
            {trackingId && (
              <button
                onClick={() => { navigate(`/track/${trackingId}`); onClose(); }}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-accent transition-colors"
              >
                <FiNavigation className="w-4 h-4" /> Track
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessNotification;
