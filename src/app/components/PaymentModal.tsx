"use client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  onContinue: () => Promise<void> | void;
  onBackHome: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onContinue,
  onBackHome,
}: PaymentModalProps) {
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
              await onContinue();
            }}
          >
            Continue
          </button>

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