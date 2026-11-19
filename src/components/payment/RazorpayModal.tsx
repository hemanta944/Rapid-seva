import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  X,
  ShieldCheck,
  IndianRupee,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../hooks/useStore';
import { generateInvoicePdf } from '../../services/pdfService';

interface RazorpayModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { requests, settings, store } = useStore();
  const request = requests.find((r) => r.id === bookingId);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash'>('UPI');
  const [upiVpa, setUpiVpa] = useState('bikash.baruah@oksbi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('***');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastPaymentRecord, setLastPaymentRecord] = useState<any | null>(null);

  if (!isOpen || !request) return null;

  const totalAmount = request.finalPrice || request.estimatedPrice || 399;
  const platformFee = Math.round(totalAmount * (settings.platformCommissionPercent / 100) * 100) / 100;
  const providerPayout = Math.round((totalAmount - platformFee) * 100) / 100;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const payment = store.processPayment(request.id, paymentMethod);
      setLastPaymentRecord(payment);
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F04416', '#FF6B35', '#111111', '#10B981'],
      });

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-scaleUp">
        {/* Razorpay Sandbox Header */}
        <div className="bg-[#111111] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F04416] text-white flex items-center justify-center font-black text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight">Razorpay Checkout</span>
                <span className="text-[9px] uppercase font-bold bg-amber-400 text-black px-1.5 py-0.2 rounded font-mono">
                  Sandbox
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Secured with 256-Bit SSL Encryption</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Due</span>
                <span className="text-2xl font-black text-gray-900">₹{totalAmount}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Booking</span>
                <span className="text-xs font-mono font-bold text-gray-700">{request.id}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 block">
                Choose Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-[#F04416] bg-orange-50/50 text-[#F04416] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">UPI (Instant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'Card'
                      ? 'border-[#F04416] bg-orange-50/50 text-[#F04416] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'NetBanking'
                      ? 'border-[#F04416] bg-orange-50/50 text-[#F04416] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Dynamic Form based on method */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Supported Apps: GPay, PhonePe, Paytm, BHIM</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono"
                    placeholder="mobile@upi"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Card Number (Test Simulation)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">
                  Select Bank
                </label>
                <select className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-semibold">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Split fee breakdown */}
            <div className="text-[11px] text-gray-500 space-y-1 pt-1 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Technician Service Fee:</span>
                <span className="font-medium text-gray-700">₹{providerPayout}</span>
              </div>
              <div className="flex justify-between">
                <span>RapidSeva Platform Fee ({settings.platformCommissionPercent}%):</span>
                <span className="font-medium text-gray-700">₹{platformFee}</span>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#F04416] hover:bg-[#D8380E] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-brand flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying with Bank...' : `PAY ₹${totalAmount} NOW`}</span>
            </button>
          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                Payment Successful
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">₹{totalAmount} Paid</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Transaction ID: {lastPaymentRecord?.id || 'pay_rzp_mock'}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-left space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Service Category:</span>
                <span className="font-bold text-gray-900">{request.serviceCategoryName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Technician:</span>
                <span className="font-bold text-gray-900">{request.providerName || 'Attending Tech'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Paid Via:</span>
                <span className="font-bold text-gray-900">{paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => generateInvoicePdf(request, lastPaymentRecord)}
                className="w-full py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Download Official GST Tax Invoice (PDF)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
              >
                Done & Return to App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
