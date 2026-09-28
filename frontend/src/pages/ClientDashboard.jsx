import { useEffect, useState } from "react";

function ClientDashboard({ setPage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/client/${userId}`
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
      console.log("CLIENT ORDERS ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handleCancel = async (orderId) => {
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
            status: "cancelled",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Order cancelled successfully.");
        fetchOrders();
      } else {
        setMessage(
          data.message || "Failed to cancel order."
        );
      }
    } catch (error) {
      console.log("CANCEL ORDER ERROR:", error);

      setMessage("Something went wrong.");
    }
  };

  const openReviewPopup = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment("");
    setMessage("");
  };

  const closeReviewPopup = () => {
    setSelectedOrder(null);
    setRating(5);
    setComment("");
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder) return;

    if (!comment.trim()) {
      setMessage("Please write a review comment.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: userId,
            orderId: selectedOrder._id,
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Review submitted successfully! ⭐");

        closeReviewPopup();
        fetchOrders();
      } else {
        setMessage(
          data.message || "Failed to submit review."
        );
      }
    } catch (error) {
      console.log("REVIEW ERROR:", error);

      setMessage("Something went wrong.");
    }
  };

  const getStatusClass = (status) => {
    return `dashboard-status ${status}`;
  };

  return (
    <div className="dashboard-page">

      {/* Background Glow */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">

          <div>
            <span className="dashboard-label">
              CLIENT DASHBOARD
            </span>

            <h1>Welcome back, {user?.name} 👋</h1>

            <p>
              Manage your orders and review your
              freelancer experiences.
            </p>
          </div>

          <button
            className="dashboard-home-button"
            onClick={() => setPage("home")}
          >
            ← Home
          </button>

        </div>

        {/* Message */}
        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <span>📦</span>

            <div>
              <strong>{orders.length}</strong>
              <small>Total Orders</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>⏳</span>

            <div>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.status === "pending"
                  ).length
                }
              </strong>

              <small>Pending</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>⚡</span>

            <div>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.status === "accepted"
                  ).length
                }
              </strong>

              <small>In Progress</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span>✓</span>

            <div>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.status === "completed"
                  ).length
                }
              </strong>

              <small>Completed</small>
            </div>
          </div>

        </div>

        {/* Orders */}
        <div className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <span>YOUR ORDERS</span>
              <h2>Recent Projects</h2>
            </div>

            <span className="order-count">
              {orders.length} orders
            </span>

          </div>

          {orders.length === 0 ? (
            <div className="empty-dashboard">

              <div className="empty-icon">
                📦
              </div>

              <h3>No orders yet</h3>

              <p>
                Explore available gigs and hire a
                freelancer to get started.
              </p>

              <button
                onClick={() => setPage("home")}
              >
                Explore Gigs
              </button>

            </div>
          ) : (
            <div className="orders-grid">

              {orders.map((order) => (
                <div
                  className="dashboard-order-card"
                  key={order._id}
                >

                  {/* Top */}
                  <div className="order-card-top">

                    <span className="order-category">
                      {order.gig?.category ||
                        "Service"}
                    </span>

                    <span
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* Gig */}
                  <h3>
                    {order.gig?.title ||
                      "Gig unavailable"}
                  </h3>

                  {/* Freelancer */}
                  <div className="order-freelancer">

                    <div className="order-avatar">
                      {order.freelancer?.name
                        ? order.freelancer.name
                            .charAt(0)
                            .toUpperCase()
                        : "F"}
                    </div>

                    <div>
                      <small>
                        Freelancer
                      </small>

                      <strong>
                        {order.freelancer?.name ||
                          "Unknown"}
                      </strong>
                    </div>

                  </div>

                  {/* Price */}
                  <div className="order-price-row">

                    <span>
                      Order Amount
                    </span>

                    <strong>
                      ₹{order.amount}
                    </strong>

                  </div>

                  {/* Date */}
                  <div className="order-date">
                    Ordered{" "}
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
                  </div>

                  {/* Actions */}
                  <div className="order-actions">

                    {(order.status === "pending" ||
                      order.status === "accepted") && (
                      <button
                        className="dashboard-cancel-button"
                        onClick={() =>
                          handleCancel(order._id)
                        }
                      >
                        Cancel Order
                      </button>
                    )}

                    {order.status ===
                      "completed" && (
                      <button
                        className="dashboard-review-button"
                        onClick={() =>
                          openReviewPopup(order)
                        }
                      >
                        ⭐ Leave a Review
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* Review Popup */}
      {selectedOrder && (
        <div className="review-overlay">

          <div className="review-box">

            <button
              className="review-close"
              onClick={closeReviewPopup}
            >
              ×
            </button>

            <div className="review-icon">
              ⭐
            </div>

            <h2>Leave a Review</h2>

            <p>
              How was your experience with{" "}
              <strong>
                {selectedOrder.freelancer?.name ||
                  "this freelancer"}
              </strong>
              ?
            </p>

            {/* Stars */}
            <div className="star-rating">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    className={
                      star <= rating
                        ? "star active"
                        : "star"
                    }
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    ★
                  </button>
                )
              )}

            </div>

            <div className="rating-text">
              {rating === 5
                ? "Excellent!"
                : rating === 4
                ? "Great!"
                : rating === 3
                ? "Good"
                : rating === 2
                ? "Needs improvement"
                : "Poor"}
            </div>

            {/* Comment */}
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              rows="5"
            />

            <div className="review-actions">

              <button
                className="close-review-button"
                onClick={closeReviewPopup}
              >
                Cancel
              </button>

              <button
                className="submit-review-button"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ClientDashboard;