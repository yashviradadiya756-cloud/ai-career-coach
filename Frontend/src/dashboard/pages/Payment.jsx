import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Crown,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock3,
  Receipt,
  Zap,
  Star,
} from "lucide-react";

import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from "../../api/paymentApi";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PAYMENT HISTORY
  // =====================================================

  const loadPaymentHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await getPaymentHistory();

      if (response.data.success) {
        setPayments(response.data.payments || []);
      }
    } catch (error) {
      console.error(
        "Payment History Error:",
        error.response?.data || error.message
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  // =====================================================
  // START RAZORPAY PAYMENT
  // =====================================================

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      // Create order
      const response = await createOrder();

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create order"
        );
      }

      const order = response.data.order;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,

        name: "CareerPilot",

        description: "CareerPilot Pro Subscription",

        order_id: order.id,

        handler: async function (razorpayResponse) {
          try {
            const verifyResponse = await verifyPayment({
              razorpay_order_id:
                razorpayResponse.razorpay_order_id,

              razorpay_payment_id:
                razorpayResponse.razorpay_payment_id,

              razorpay_signature:
                razorpayResponse.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              setMessage(
                "Payment successful! CareerPilot Pro is now active."
              );

              await loadPaymentHistory();
            } else {
              setError("Payment verification failed.");
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error.response?.data || error.message
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed."
            );
          }
        },

        prefill: {
          name: "",
          email: "",
        },

        theme: {
          color: "#6d5dfc",
        },

        modal: {
          ondismiss: function () {
            setMessage("Payment window closed.");
          },
        },
      };

      // Check Razorpay
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not loaded."
        );
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Create Payment Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK PLAN
  // =====================================================

  const isProActive = payments.some(
    (payment) =>
      payment.status?.toLowerCase() === "success"
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .payment-page {
          min-height: 100vh;
          padding: 35px;
          background:
            radial-gradient(
              circle at top right,
              rgba(109, 93, 252, 0.10),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #f8f9ff 0%,
              #f5f7fb 50%,
              #ffffff 100%
            );
          color: #172033;
        }

        .payment-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .payment-title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .payment-icon {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: linear-gradient(
            135deg,
            #6d5dfc,
            #8b7cff
          );
          box-shadow:
            0 10px 25px rgba(109, 93, 252, 0.25);
        }

        .payment-title h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .payment-title p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border-radius: 30px;
          background: #ecfdf5;
          color: #047857;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #bbf7d0;
        }

        /* ================= ALERTS ================= */

        .payment-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 18px;
          border-radius: 14px;
          margin-bottom: 22px;
          font-size: 14px;
          font-weight: 600;
          animation: slideDown 0.25s ease;
        }

        .success-alert {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .error-alert {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================= MAIN GRID ================= */

        .payment-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 25px;
          align-items: stretch;
        }

        /* ================= PRO CARD ================= */

        .pro-card {
          position: relative;
          overflow: hidden;
          min-height: 500px;
          border-radius: 25px;
          padding: 35px;
          color: white;
          background:
            radial-gradient(
              circle at top right,
              rgba(255,255,255,0.20),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #29235c 0%,
              #4b3cb7 48%,
              #7464f7 100%
            );
          box-shadow:
            0 25px 55px rgba(68, 55, 170, 0.25);
        }

        .pro-card::before {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          right: -100px;
          top: -100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .pro-card::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          left: -80px;
          bottom: -90px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }

        .pro-content {
          position: relative;
          z-index: 2;
        }

        .popular-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          border-radius: 30px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 24px;
        }

        .pro-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .crown-box {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .pro-heading h2 {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
        }

        .pro-subtitle {
          margin: 0 0 25px;
          color: rgba(255,255,255,0.78);
          line-height: 1.6;
          font-size: 14px;
          max-width: 550px;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 27px;
        }

        .price {
          font-size: 47px;
          line-height: 1;
          font-weight: 900;
        }

        .price-period {
          color: rgba(255,255,255,0.70);
          font-size: 14px;
        }

        .feature-title {
          font-size: 13px;
          color: rgba(255,255,255,0.68);
          margin-bottom: 13px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 800;
        }

        .feature-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
          margin-bottom: 28px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 14px;
          color: rgba(255,255,255,0.93);
        }

        .feature svg {
          flex-shrink: 0;
        }

        .upgrade-btn {
          width: 100%;
          border: none;
          border-radius: 13px;
          padding: 15px 20px;
          background: white;
          color: #4b3cb7;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: all 0.2s ease;
        }

        .upgrade-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(0,0,0,0.15);
        }

        .upgrade-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .active-plan {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          padding: 7px 11px;
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          color: #dcfce7;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================= SIDE CARD ================= */

        .side-card {
          background: white;
          border: 1px solid #e8eaf2;
          border-radius: 25px;
          padding: 28px;
          box-shadow:
            0 15px 40px rgba(20, 30, 60, 0.07);
        }

        .side-card h3 {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 800;
        }

        .side-card-subtitle {
          margin: 0 0 22px;
          color: #7b8494;
          font-size: 13px;
          line-height: 1.5;
        }

        .status-box {
          padding: 18px;
          border-radius: 16px;
          background: #f8f7ff;
          border: 1px solid #e7e3ff;
          margin-bottom: 20px;
        }

        .status-label {
          color: #7b8494;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .status-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 800;
          color: #40358f;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px #dcfce7;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 0;
          border-bottom: 1px solid #f0f1f5;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f1ff;
          color: #6d5dfc;
        }

        .info-text strong {
          display: block;
          font-size: 13px;
          color: #252b3a;
          margin-bottom: 3px;
        }

        .info-text span {
          color: #7b8494;
          font-size: 12px;
        }

        /* ================= HISTORY ================= */

        .history-card {
          margin-top: 25px;
          padding: 28px;
          background: white;
          border: 1px solid #e8eaf2;
          border-radius: 25px;
          box-shadow:
            0 15px 40px rgba(20, 30, 60, 0.06);
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-title h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
        }

        .history-count {
          padding: 5px 10px;
          border-radius: 20px;
          background: #f1f0ff;
          color: #5b4ed0;
          font-size: 12px;
          font-weight: 800;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .payment-table {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
        }

        .payment-table th {
          padding: 13px 15px;
          background: #f8f9fc;
          color: #6b7280;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          font-weight: 800;
        }

        .payment-table th:first-child {
          border-radius: 10px 0 0 10px;
        }

        .payment-table th:last-child {
          border-radius: 0 10px 10px 0;
        }

        .payment-table td {
          padding: 17px 15px;
          border-bottom: 1px solid #f0f1f5;
          color: #394150;
          font-size: 13px;
        }

        .payment-table tr:last-child td {
          border-bottom: none;
        }

        .plan-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .plan-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f1ff;
          color: #6d5dfc;
        }

        .amount-cell {
          font-weight: 800;
          color: #202635 !important;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
        }

        .status-success {
          color: #047857;
          background: #ecfdf5;
        }

        .status-failed {
          color: #b91c1c;
          background: #fef2f2;
        }

        .status-pending {
          color: #a16207;
          background: #fefce8;
        }

        .transaction {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #737b8b !important;
          font-family: monospace;
          font-size: 11px !important;
        }

        .empty-history {
          padding: 50px 20px;
          text-align: center;
          color: #8a92a1;
        }

        .empty-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 12px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f6fa;
          color: #9aa1af;
        }

        /* ================= BENEFITS ================= */

        .benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 25px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px;
          background: white;
          border: 1px solid #e8eaf2;
          border-radius: 16px;
        }

        .benefit-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f3f1ff;
          color: #6d5dfc;
        }

        .benefit strong {
          display: block;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .benefit span {
          color: #7b8494;
          font-size: 11px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 950px) {
          .payment-grid {
            grid-template-columns: 1fr;
          }

          .feature-list {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .payment-page {
            padding: 20px 15px;
          }

          .payment-header {
            align-items: flex-start;
          }

          .secure-badge {
            display: none;
          }

          .payment-title h1 {
            font-size: 23px;
          }

          .pro-card {
            padding: 25px;
          }

          .feature-list {
            grid-template-columns: 1fr;
          }

          .price {
            font-size: 40px;
          }

          .history-card,
          .side-card {
            padding: 20px;
          }

          .benefits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="payment-page">
        <div className="payment-container">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="payment-header">
            <div className="payment-title-wrapper">

              <div className="payment-icon">
                <CreditCard size={25} />
              </div>

              <div className="payment-title">
                <h1>Payment & Subscription</h1>
                <p>
                  Manage your CareerPilot plan and payments
                </p>
              </div>

            </div>

            <div className="secure-badge">
              <ShieldCheck size={16} />
              Secure Payment
            </div>
          </div>

          {/* =========================================
              SUCCESS
          ========================================= */}

          {message && (
            <div className="payment-alert success-alert">
              <CheckCircle size={20} />
              {message}
            </div>
          )}

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="payment-alert error-alert">
              <Clock3 size={20} />
              {error}
            </div>
          )}

          {/* =========================================
              MAIN SECTION
          ========================================= */}

          <div className="payment-grid">

            {/* PRO PLAN */}

            <div className="pro-card">
              <div className="pro-content">

                <div className="popular-badge">
                  <Sparkles size={14} />
                  MOST POPULAR
                </div>

                <div className="pro-heading">

                  <div className="crown-box">
                    <Crown size={27} />
                  </div>

                  <div>
                    <h2>CareerPilot Pro</h2>
                  </div>

                </div>

                <p className="pro-subtitle">
                  Unlock the complete AI-powered career
                  experience and accelerate your journey
                  toward your dream job.
                </p>

                <div className="price-row">
                  <span className="price">₹299</span>
                  <span className="price-period">
                    / month
                  </span>
                </div>

                <div className="feature-title">
                  Everything you need to grow
                </div>

                <div className="feature-list">

                  <div className="feature">
                    <CheckCircle size={17} />
                    Advanced Resume Analysis
                  </div>

                  <div className="feature">
                    <CheckCircle size={17} />
                    AI Career Roadmap
                  </div>

                  <div className="feature">
                    <CheckCircle size={17} />
                    Skill Gap Analysis
                  </div>

                  <div className="feature">
                    <CheckCircle size={17} />
                    AI Mock Interviews
                  </div>

                  <div className="feature">
                    <CheckCircle size={17} />
                    Personalized Learning
                  </div>

                  <div className="feature">
                    <CheckCircle size={17} />
                    Progress Tracking
                  </div>

                </div>

                <button
                  className="upgrade-btn"
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isProActive
                    ? "Manage Pro Plan"
                    : "Upgrade to Pro"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>

                {isProActive && (
                  <div className="active-plan">
                    <CheckCircle size={14} />
                    Your Pro plan is active
                  </div>
                )}

              </div>
            </div>

            {/* CURRENT PLAN */}

            <div className="side-card">

              <h3>Current Subscription</h3>

              <p className="side-card-subtitle">
                Your current CareerPilot membership
                details.
              </p>

              <div className="status-box">

                <div className="status-label">
                  CURRENT STATUS
                </div>

                <div className="status-value">

                  <span className="status-dot"></span>

                  {isProActive
                    ? "Pro Active"
                    : "Free Plan"}

                </div>

              </div>

              <div className="info-item">

                <div className="info-icon">
                  <Crown size={18} />
                </div>

                <div className="info-text">
                  <strong>Current Plan</strong>
                  <span>
                    {isProActive
                      ? "CareerPilot Pro"
                      : "CareerPilot Free"}
                  </span>
                </div>

              </div>

              <div className="info-item">

                <div className="info-icon">
                  <CreditCard size={18} />
                </div>

                <div className="info-text">
                  <strong>Monthly Price</strong>
                  <span>
                    {isProActive
                      ? "₹299 / month"
                      : "₹0 / month"}
                  </span>
                </div>

              </div>

              <div className="info-item">

                <div className="info-icon">
                  <Calendar size={18} />
                </div>

                <div className="info-text">
                  <strong>Billing Cycle</strong>
                  <span>
                    Monthly subscription
                  </span>
                </div>

              </div>

              <div className="info-item">

                <div className="info-icon">
                  <ShieldCheck size={18} />
                </div>

                <div className="info-text">
                  <strong>Payment Security</strong>
                  <span>
                    Secured by Razorpay
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* =========================================
              BENEFITS
          ========================================= */}

          <div className="benefits">

            <div className="benefit">

              <div className="benefit-icon">
                <Zap size={18} />
              </div>

              <div>
                <strong>AI Powered</strong>
                <span>
                  Smarter career guidance
                </span>
              </div>

            </div>

            <div className="benefit">

              <div className="benefit-icon">
                <Star size={18} />
              </div>

              <div>
                <strong>Personalized</strong>
                <span>
                  Built around your goals
                </span>
              </div>

            </div>

            <div className="benefit">

              <div className="benefit-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Secure Payments</strong>
                <span>
                  Safe Razorpay checkout
                </span>
              </div>

            </div>

          </div>

          {/* =========================================
              PAYMENT HISTORY
          ========================================= */}

          <div className="history-card">

            <div className="history-header">

              <div className="history-title">

                <Receipt
                  size={20}
                  color="#6d5dfc"
                />

                <h3>Payment History</h3>

                <span className="history-count">
                  {payments.length}
                </span>

              </div>

            </div>

            {historyLoading ? (

              <div className="empty-history">
                Loading payment history...
              </div>

            ) : payments.length === 0 ? (

              <div className="empty-history">

                <div className="empty-icon">
                  <Receipt size={24} />
                </div>

                <strong>
                  No payments yet
                </strong>

                <p>
                  Your successful transactions
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="payment-table">

                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>

                  <tbody>

                    {payments.map((payment) => {

                      const status =
                        payment.status?.toLowerCase();

                      return (
                        <tr key={payment._id}>

                          <td>

                            <div className="plan-cell">

                              <div className="plan-icon">
                                <Crown size={16} />
                              </div>

                              {payment.plan ||
                                "CareerPilot Pro"}

                            </div>

                          </td>

                          <td className="amount-cell">
                            ₹
                            {(
                              payment.amount / 100
                            ).toFixed(0)}
                          </td>

                          <td>
                            {new Date(
                              payment.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>

                          <td>

                            <span
                              className={`status-pill ${
                                status === "success"
                                  ? "status-success"
                                  : status === "failed"
                                  ? "status-failed"
                                  : "status-pending"
                              }`}
                            >

                              {status === "success" && (
                                <CheckCircle size={13} />
                              )}

                              {payment.status}

                            </span>

                          </td>

                          <td className="transaction">

                            {payment.transactionId ||
                              "Pending"}

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default Payment;