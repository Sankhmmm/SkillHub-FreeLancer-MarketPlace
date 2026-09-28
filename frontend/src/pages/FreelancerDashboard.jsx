import { useEffect, useState } from "react";

function FreelancerDashboard({ setPage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/freelancer/${userId}`
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setMessage(
          data.message || "Failed to load orders."
        );
      }
    } catch (error) {
      console.log("FREELANCER ORDERS ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          status === "accepted"
            ? "Order accepted successfully! 🎉"
            : status === "completed"
            ? "Order marked as completed! ✓"
            : "Order cancelled."
        );

        fetchOrders();
      } else {
        setMessage(
          data.message || "Failed to update order."
        );
      }
    } catch (error) {
      console.log("ORDER STATUS ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const activeOrders = orders.filter(
    (order) => order.status === "accepted"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const totalEarnings = completedOrders.reduce(
    (total, order) => total + Number(order.amount || 0),
    0
  );

  return (
    <div className="freelancer-dashboard-page">

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="freelancer-dashboard-container">

        {/* Header */}

        <div className="freelancer-dashboard-header">

          <div>
            <span className="freelancer-dashboard-label">
              FREELANCER DASHBOARD
            </span>

            <h1>
              Welcome back, {user?.name} 👋
            </h1>

            <p>
              Manage your projects, orders and earnings
              from one place.
            </p>
          </div>

          <div className="freelancer-header-actions">

            <button
              className="freelancer-profile-button"
              onClick={() => setPage("profile")}
            >
              My Profile
            </button>

            <button
              className="freelancer-home-button"
              onClick={() => setPage("home")}
            >
              ← Home
            </button>

          </div>

        </div>

        {/* Message */}

        {message && (
          <div className="freelancer-dashboard-message">
            {message}
          </div>
        )}

        {/* Statistics */}

        <div className="freelancer-stats">

          <div className="freelancer-stat-card">

            <div className="freelancer-stat-icon">
              📦
            </div>

            <div>
              <strong>
                {orders.length}
              </strong>

              <span>
                Total Orders
              </span>
            </div>

          </div>

          <div className="freelancer-stat-card">

            <div className="freelancer-stat-icon">
              🔔
            </div>

            <div>
              <strong>
                {pendingOrders.length}
              </strong>

              <span>
                New Requests
              </span>
            </div>

          </div>

          <div className="freelancer-stat-card">

            <div className="freelancer-stat-icon">
              ⚡
            </div>

            <div>
              <strong>
                {activeOrders.length}
              </strong>

              <span>
                Active Projects
              </span>
            </div>

          </div>

          <div className="freelancer-stat-card">

            <div className="freelancer-stat-icon">
              ₹
            </div>

            <div>
              <strong>
                ₹{totalEarnings}
              </strong>

              <span>
                Completed Earnings
              </span>
            </div>

          </div>

        </div>

        {/* Orders Section */}

        <div className="freelancer-orders-section">

          <div className="freelancer-section-heading">

            <div>
              <span>PROJECT MANAGEMENT</span>

              <h2>
                Your Orders
              </h2>
            </div>

            <span className="freelancer-order-count">
              {orders.length} orders
            </span>

          </div>

          {orders.length === 0 ? (
            <div className="freelancer-empty">

              <div className="freelancer-empty-icon">
                🚀
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Create a gig and start receiving
                orders from clients.
              </p>

              <button
                onClick={() =>
                  setPage("create-gig")
                }
              >
                Create a Gig ✨
              </button>

            </div>
          ) : (
            <div className="freelancer-orders-grid">

              {orders.map((order) => (

                <div
                  className="freelancer-order-card"
                  key={order._id}
                >

                  {/* Top */}

                  <div className="freelancer-order-top">

                    <span className="freelancer-order-category">
                      {order.gig?.category ||
                        "Service"}
                    </span>

                    <span
                      className={`freelancer-order-status ${order.status}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* Title */}

                  <h3>
                    {order.gig?.title ||
                      "Gig unavailable"}
                  </h3>

                  {/* Client */}

                  <div className="freelancer-client">

                    <div className="freelancer-client-avatar">
                      {order.client?.name
                        ? order.client.name
                            .charAt(0)
                            .toUpperCase()
                        : "C"}
                    </div>

                    <div>

                      <small>
                        Client
                      </small>

                      <strong>
                        {order.client?.name ||
                          "Unknown Client"}
                      </strong>

                    </div>

                  </div>

                  {/* Amount */}

                  <div className="freelancer-order-info">

                    <div>
                      <span>
                        Order Value
                      </span>

                      <strong>
                        ₹{order.amount}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Ordered
                      </span>

                      <strong className="order-date-value">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* Actions */}

                  <div className="freelancer-order-actions">

                    {order.status === "pending" && (
                      <>
                        <button
                          className="accept-order-button"
                          onClick={() =>
                            updateOrderStatus(
                              order._id,
                              "accepted"
                            )
                          }
                        >
                          ✓ Accept Order
                        </button>

                        <button
                          className="cancel-order-button"
                          onClick={() =>
                            updateOrderStatus(
                              order._id,
                              "cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "accepted" && (
                      <>
                        <button
                          className="complete-order-button"
                          onClick={() =>
                            updateOrderStatus(
                              order._id,
                              "completed"
                            )
                          }
                        >
                          ✓ Mark Completed
                        </button>

                        <button
                          className="cancel-order-button"
                          onClick={() =>
                            updateOrderStatus(
                              order._id,
                              "cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "completed" && (
                      <div className="completed-order-message">
                        <span>✓</span>

                        <div>
                          <strong>
                            Project Completed
                          </strong>

                          <small>
                            Payment earned: ₹
                            {order.amount}
                          </small>
                        </div>
                      </div>
                    )}

                    {order.status === "cancelled" && (
                      <div className="cancelled-order-message">
                        This order was cancelled.
                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default FreelancerDashboard;