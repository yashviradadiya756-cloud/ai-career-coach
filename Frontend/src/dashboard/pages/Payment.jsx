import React, { useEffect, useState } from "react";

import {
  CreditCard,
  CheckCircle,
  Crown,
  Download,
  Calendar,
} from "lucide-react";

import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from "../../api/paymentApi";


const Payment = () => {

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD PAYMENT HISTORY
  // =====================================================

  const loadPaymentHistory = async () => {

    try {

      setHistoryLoading(true);

      const response =
        await getPaymentHistory();

      if (response.data.success) {

        setPayments(
          response.data.payments || []
        );
      }

    } catch (error) {

      console.error(
        "Payment History Error:",
        error.response?.data ||
          error.message
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


      // Step 1
      // Create order on backend

      const response =
        await createOrder();


      if (!response.data.success) {

        throw new Error(
          response.data.message ||
          "Failed to create order"
        );
      }


      const order =
        response.data.order;


      // Step 2
      // Razorpay Checkout

      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          order.amount,

        currency:
          order.currency,

        name:
          "CareerPilot",

        description:
          "CareerPilot Pro Subscription",

        order_id:
          order.id,


        handler: async function (
          razorpayResponse
        ) {

          try {

            // Step 3
            // Verify payment on backend

            const verifyResponse =
              await verifyPayment({

                razorpay_order_id:
                  razorpayResponse
                    .razorpay_order_id,

                razorpay_payment_id:
                  razorpayResponse
                    .razorpay_payment_id,

                razorpay_signature:
                  razorpayResponse
                    .razorpay_signature,
              });


            if (
              verifyResponse.data.success
            ) {

              setMessage(
                "🎉 Payment successful! CareerPilot Pro activated."
              );

              await loadPaymentHistory();

            } else {

              setError(
                "Payment verification failed."
              );
            }

          } catch (error) {

            console.error(
              "Payment Verification Error:",
              error.response?.data ||
                error.message
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
          color: "#2563eb",
        },


        modal: {

          ondismiss: function () {

            setMessage(
              "Payment window closed."
            );
          },
        },
      };


      // Check Razorpay loaded

      if (
        !window.Razorpay
      ) {

        throw new Error(
          "Razorpay Checkout is not loaded."
        );
      }


      const razorpay =
        new window.Razorpay(
          options
        );


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
        error.response?.data ||
          error.message
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
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >

        <CreditCard />

        Payment & Subscription

      </h2>


      {/* SUCCESS MESSAGE */}

      {message && (

        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>

      )}


      {/* ERROR MESSAGE */}

      {error && (

        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>

      )}


      {/* CURRENT PLAN */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,.08)",
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
          <strong>
            Plan:
          </strong>{" "}
          CareerPilot Pro
        </p>


        <p>
          <strong>
            Price:
          </strong>{" "}
          ₹299 / Month
        </p>


        <p>

          <strong>
            Status:
          </strong>{" "}

          <span
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >

            {payments.some(
              (payment) =>
                payment.status ===
                "Success"
            )
              ? "Active"
              : "Free"}

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

          Monthly subscription

        </p>


        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            background: loading
              ? "#93c5fd"
              : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >

          {loading
            ? "Processing..."
            : "Upgrade Plan"}

        </button>

      </div>


      {/* PAYMENT HISTORY */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "25px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,.08)",
        }}
      >

        <h3
          style={{
            marginBottom: "20px",
          }}
        >

          Payment History

        </h3>


        {historyLoading ? (

          <p>
            Loading payment history...
          </p>

        ) : payments.length === 0 ? (

          <p>
            No payment history found.
          </p>

        ) : (

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    "#eff6ff",
                }}
              >

                <th
                  style={{
                    padding: "12px",
                  }}
                >
                  Plan
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Transaction
                </th>

              </tr>

            </thead>


            <tbody>

              {payments.map(
                (payment) => (

                  <tr
                    key={
                      payment._id
                    }
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                      textAlign:
                        "center",
                    }}
                  >

                    <td
                      style={{
                        padding: "15px",
                      }}
                    >

                      {payment.plan}

                    </td>


                    <td>

                      ₹
                      {(
                        payment.amount /
                        100
                      ).toFixed(0)}

                    </td>


                    <td>

                      {new Date(
                        payment.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month:
                            "short",
                          year:
                            "numeric",
                        }
                      )}

                    </td>


                    <td
                      style={{
                        color:
                          payment.status ===
                          "Success"
                            ? "green"
                            : payment.status ===
                              "Failed"
                            ? "red"
                            : "#f59e0b",

                        fontWeight:
                          "600",
                      }}
                    >

                      {payment.status ===
                        "Success" && (

                        <CheckCircle
                          size={16}
                          style={{
                            marginRight:
                              "5px",
                            verticalAlign:
                              "middle",
                          }}
                        />

                      )}

                      {payment.status}

                    </td>


                    <td>

                      {payment.transactionId
                        ? payment.transactionId
                        : "Pending"}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};


export default Payment;