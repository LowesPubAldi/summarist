"use client";

import { useEffect, useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  onContinue: () => Promise<void> | void;
  onBackHome: () => void;
  checkoutDisabled?: boolean;
  unavailableMessage?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onContinue,
  onBackHome,
  checkoutDisabled = false,
  unavailableMessage = "Checkout is unavailable at the moment on this platform",
}: PaymentModalProps) {
  const [showUnavailableTip, setShowUnavailableTip] = useState(false);

  useEffect(() => {
    if (!showUnavailableTip) return;

    const timer = window.setTimeout(() => {
      setShowUnavailableTip(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [showUnavailableTip]);

  if (!isOpen) return null;

  return (
    <div className="payment-modal__overlay">
      <div className="payment-modal">
        <button type="button" className="payment-modal__close" onClick={onClose}>
          ×
        </button>

        <h2>Confirm Your Plan</h2>

        <p>
          {selectedPlan === "monthly"
            ? "Premium Monthly - $9.99/month"
            : "Premium Plus Yearly - $99.99/year"}
        </p>

        <div className="payment-modal__buttons">
          <button
            className="payment-modal__continue"
            onClick={async () => {
              if (checkoutDisabled) {
                setShowUnavailableTip(true);
                return;
              }

              await onContinue();
            }}
          >
            Continue
          </button>

          {showUnavailableTip && (
            <p className="payment-modal__tooltip" role="status" aria-live="polite">
              {unavailableMessage}
            </p>
          )}

          <button
            className="payment-modal__back"
            onClick={onBackHome}
          >
            Back to Home
          </button>
        </div>
        </div>
      </div>
  );
}