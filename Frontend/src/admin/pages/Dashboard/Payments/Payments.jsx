import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import "./Payments.css";

const payments = [
  {
    id: 1,
    user: "Rahul Sharma",
    paymentId: "PAY102341",
    amount: "₹499",
    method: "UPI",
    date: "22 Jul 2026",
    status: "Paid",
  },
  {
    id: 2,
    user: "Priya Patel",
    paymentId: "PAY102342",
    amount: "₹999",
    method: "Credit Card",
    date: "21 Jul 2026",
    status: "Paid",
  },
  {
    id: 3,
    user: "Amit Shah",
    paymentId: "PAY102343",
    amount: "₹299",
    method: "Net Banking",
    date: "20 Jul 2026",
    status: "Pending",
  },
  {
    id: 4,
    user: "Neha Verma",
    paymentId: "PAY102344",
    amount: "₹1499",
    method: "Debit Card",
    date: "18 Jul 2026",
    status: "Failed",
  },
];

export default function Payments() {
  const [search, setSearch] = useState("");

  const filtered = payments.filter(
    (item) =>
      item.user.toLowerCase().includes(search.toLowerCase()) ||
      item.paymentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="payments-page">

      <div className="payments-header">
        <h2>Payments Management</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Payment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="summary-grid">

        <div className="summary-card revenue">
          <DollarSign size={30} />
          <h3>₹2,85,000</h3>
          <p>Total Revenue</p>
        </div>

        <div className="summary-card success">
          <CheckCircle size={30} />
          <h3>1,240</h3>
          <p>Successful</p>
        </div>

        <div className="summary-card pending">
          <Clock size={30} />
          <h3>82</h3>
          <p>Pending</p>
        </div>

        <div className="summary-card failed">
          <XCircle size={30} />
          <h3>15</h3>
          <p>Failed</p>
        </div>

      </div>

      <div className="payments-table">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.user}</td>

                <td>{item.paymentId}</td>

                <td>{item.amount}</td>

                <td>{item.method}</td>

                <td>{item.date}</td>

                <td>
                  <span className={item.status.toLowerCase()}>
                    {item.status}
                  </span>
                </td>

                <td className="actions">

                  <button className="view">
                    <Eye size={18}/>
                  </button>

                  <button className="delete">
                    <Trash2 size={18}/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <CreditCard size={60}/>
            <h3>No Payment Records Found</h3>
          </div>
        )}

      </div>

    </div>
  );
}