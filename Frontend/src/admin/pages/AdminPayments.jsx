import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Crown,
  CheckCircle,
  Clock3,
  XCircle,
  RefreshCw,
  Search,
  Users,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Receipt,
  User,
} from "lucide-react";

import { getAdminPayments } from "../../api/adminApi";
import "../styles/adminPayments.css";

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  const loadPayments = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getAdminPayments();

      console.log("================================");
      console.log("ADMIN PAYMENT RESPONSE");
      console.log("================================");
      console.log(data);

      if (data?.success) {
        setPayments(data.payments || []);
      } else {
        setPayments([]);
        setError(
          data?.message || "Failed to load payment data."
        );
      }
    } catch (error) {
      console.error(
        "ADMIN PAYMENT FRONTEND ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadPayments(true);
  }, []);

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const user = payment.user || {};

      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.username?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        payment.plan?.toLowerCase().includes(searchText) ||
        payment.transactionId
          ?.toLowerCase()
          .includes(searchText) ||
        payment.orderId
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const successful = payments.filter(
      (payment) =>
        payment.status?.toLowerCase() === "success"
    );

    const pending = payments.filter(
      (payment) =>
        payment.status?.toLowerCase() === "pending"
    );

    const failed = payments.filter(
      (payment) =>
        payment.status?.toLowerCase() === "failed"
    );

    const totalRevenue = successful.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

    return {
      total: payments.length,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      revenue: totalRevenue / 100,
    };
  }, [payments]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const renderStatus = (status) => {
    const normalized =
      status?.toLowerCase();

    if (normalized === "success") {
      return (
        <span className="admin-payment-status success">
          <CheckCircle size={14} />
          Success
        </span>
      );
    }

    if (normalized === "failed") {
      return (
        <span className="admin-payment-status failed">
          <XCircle size={14} />
          Failed
        </span>
      );
    }

    return (
      <span className="admin-payment-status pending">
        <Clock3 size={14} />
        Pending
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-payment-page">
        <div className="admin-payment-loading">
          <RefreshCw
            size={30}
            className="admin-payment-spin"
          />

          <h3>Loading payments...</h3>

          <p>
            Please wait while payment records are
            loaded.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-payment-page">

      <div className="admin-payment-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-payment-header">

          <div className="admin-payment-header-left">

            <div className="admin-payment-header-icon">
              <CreditCard size={26} />
            </div>

            <div>
              <h1>Payment Management</h1>

              <p>
                Monitor all CareerPilot user payments
                and transactions.
              </p>
            </div>

          </div>

          <button
            className="admin-payment-refresh"
            onClick={() => loadPayments(false)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "admin-payment-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-payment-error">

            <AlertCircle size={20} />

            <div>
              <strong>
                Unable to load payments
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={() => loadPayments(true)}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="admin-payment-stats">

          {/* TOTAL */}

          <div className="admin-payment-stat-card">

            <div className="admin-payment-stat-icon purple">
              <Receipt size={21} />
            </div>

            <div>
              <span>Total Payments</span>
              <strong>
                {statistics.total}
              </strong>
            </div>

          </div>

          {/* SUCCESS */}

          <div className="admin-payment-stat-card">

            <div className="admin-payment-stat-icon green">
              <CheckCircle size={21} />
            </div>

            <div>
              <span>Successful</span>
              <strong>
                {statistics.successful}
              </strong>
            </div>

          </div>

          {/* PENDING */}

          <div className="admin-payment-stat-card">

            <div className="admin-payment-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {statistics.pending}
              </strong>
            </div>

          </div>

          {/* FAILED */}

          <div className="admin-payment-stat-card">

            <div className="admin-payment-stat-icon red">
              <XCircle size={21} />
            </div>

            <div>
              <span>Failed</span>
              <strong>
                {statistics.failed}
              </strong>
            </div>

          </div>

          {/* REVENUE */}

          <div className="admin-payment-stat-card">

            <div className="admin-payment-stat-icon blue">
              <TrendingUp size={21} />
            </div>

            <div>
              <span>Total Revenue</span>
              <strong>
                ₹
                {statistics.revenue.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="admin-payment-card">

          {/* TABLE HEADER */}

          <div className="admin-payment-table-header">

            <div>

              <h2>
                All Payments
              </h2>

              <p>
                {filteredPayments.length} payment
                {filteredPayments.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

            <div className="admin-payment-filters">

              {/* SEARCH */}

              <div className="admin-payment-search">

                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search user, email, transaction..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="admin-payment-select"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Failed">
                  Failed
                </option>
              </select>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          {filteredPayments.length === 0 ? (

            <div className="admin-payment-empty">

              <div className="admin-payment-empty-icon">
                <CreditCard size={30} />
              </div>

              <h3>
                No payments found
              </h3>

              <p>
                {payments.length === 0
                  ? "There are no payment records in the database yet."
                  : "No payments match your current search or filter."}
              </p>

              {payments.length === 0 && (
                <button
                  onClick={() =>
                    loadPayments(true)
                  }
                  className="admin-payment-empty-button"
                >
                  <RefreshCw size={16} />
                  Reload Payments
                </button>
              )}

            </div>

          ) : (

            <div className="admin-payment-table-wrapper">

              <table className="admin-payment-table">

                <thead>

                  <tr>

                    <th>User</th>

                    <th>Plan</th>

                    <th>Amount</th>

                    <th>Payment Method</th>

                    <th>Status</th>

                    <th>Order ID</th>

                    <th>Transaction ID</th>

                    <th>Date</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPayments.map(
                    (payment) => {

                      const user =
                        payment.user || {};

                      return (
                        <tr
                          key={
                            payment._id
                          }
                        >

                          {/* USER */}

                          <td>

                            <div className="admin-payment-user">

                              <div className="admin-payment-avatar">

                                {user.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() || (
                                  <User
                                    size={16}
                                  />
                                )}

                              </div>

                              <div>

                                <strong>
                                  {user.name ||
                                    user.username ||
                                    "Unknown User"}
                                </strong>

                                <span>
                                  {user.email ||
                                    "No email"}
                                </span>

                                {user.phone && (
                                  <small>
                                    {user.phone}
                                  </small>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* PLAN */}

                          <td>

                            <div className="admin-payment-plan">

                              <div className="admin-payment-plan-icon">
                                <Crown
                                  size={15}
                                />
                              </div>

                              <span>
                                {payment.plan ||
                                  "Pro"}
                              </span>

                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td>

                            <strong className="admin-payment-amount">

                              ₹
                              {(
                                Number(
                                  payment.amount ||
                                    0
                                ) / 100
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </strong>

                          </td>

                          {/* METHOD */}

                          <td>

                            <span className="admin-payment-method">

                              <CreditCard
                                size={14}
                              />

                              {payment.paymentMethod ||
                                "Razorpay"}

                            </span>

                          </td>

                          {/* STATUS */}

                          <td>
                            {renderStatus(
                              payment.status
                            )}
                          </td>

                          {/* ORDER */}

                          <td>

                            <span
                              className="admin-payment-id"
                              title={
                                payment.orderId ||
                                ""
                              }
                            >
                              {payment.orderId ||
                                "—"}
                            </span>

                          </td>

                          {/* TRANSACTION */}

                          <td>

                            <span
                              className="admin-payment-id"
                              title={
                                payment.transactionId ||
                                ""
                              }
                            >
                              {payment.transactionId ||
                                "Pending"}
                            </span>

                          </td>

                          {/* DATE */}

                          <td>

                            <div className="admin-payment-date">

                              <strong>
                                {formatDate(
                                  payment.createdAt
                                )}
                              </strong>

                              <span>
                                {formatTime(
                                  payment.createdAt
                                )}
                              </span>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            FOOTER INFO
        ================================================= */}

        <div className="admin-payment-footer">

          <div>
            <Users size={17} />

            <span>
              Total user transactions:
              <strong>
                {" "}
                {payments.length}
              </strong>
            </span>
          </div>

          <div>
            <IndianRupee size={17} />

            <span>
              Successful revenue:
              <strong>
                {" "}
                ₹
                {statistics.revenue.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </span>
          </div>

          <div>
            <Clock3 size={17} />

            <span>
              Pending payments:
              <strong>
                {" "}
                {statistics.pending}
              </strong>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminPayment;