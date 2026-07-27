import React from "react";
import {
  CreditCard,
  CheckCircle,
  Crown,
  Download,
  Calendar,
} from "lucide-react";

const Payment = () => {
  const paymentHistory = [
    {
      id: 1,
      plan: "CareerPilot Pro",
      amount: "₹299",
      date: "20 July 2026",
      status: "Paid",
    },
    {
      id: 2,
      plan: "CareerPilot Pro",
      amount: "₹299",
      date: "20 June 2026",
      status: "Paid",
    },
    {
      id: 3,
      plan: "CareerPilot Pro",
      amount: "₹299",
      date: "20 May 2026",
      status: "Paid",
    },
  ];

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <CreditCard color="#2563eb" />
        Payment & Subscription
      </h2>

      {/* Current Plan */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Crown color="#f59e0b" />
          Current Plan
        </h3>

        <p>
          <strong>Plan:</strong> CareerPilot Pro
        </p>

        <p>
          <strong>Price:</strong> ₹299 / Month
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
            Active
          </span>
        </p>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Calendar size={18} />
          Next Billing Date: 20 August 2026
        </p>

        <button
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Upgrade Plan
        </button>
      </div>

      {/* Payment History */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Payment History</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#eff6ff" }}>
              <th style={{ padding: "12px" }}>Plan</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {paymentHistory.map((payment) => (
              <tr
                key={payment.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <td style={{ padding: "15px" }}>{payment.plan}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>

                <td
                  style={{
                    color: "green",
                    fontWeight: "600",
                  }}
                >
                  <CheckCircle
                    size={16}
                    style={{
                      marginRight: "5px",
                      verticalAlign: "middle",
                    }}
                  />
                  {payment.status}
                </td>

                <td>
                  <button
                    style={{
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;