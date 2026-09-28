import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function GigDetails({
  gigId,
  setPage,
  setSelectedFreelancer,
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/gigs/${gigId}`)
      .then((response) => response.json())
      .then((data) => setGig(data))
      .catch((error) => {
        console.log("Error loading gig:", error);
        setMessage("Could not load gig.");
      });
  }, [gigId]);

  const handleHire = async () => {
    const clientId = user?.id || user?._id;

    if (!clientId) {
      setMessage("Please login first.");
      return;
    }

    if (user?.role !== "client") {
      setMessage("Only clients can hire freelancers.");
      return;
    }

    if (!gig?._id) {
      setMessage("Gig information is missing.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
  `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: clientId,
            gigId: gig._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Hire request sent successfully! 🎉");
      } else {
        setMessage(
          data.message || "Failed to send hire request."
        );
      }
    } catch (error) {
      console.log("HIRE ERROR:", error);

      setMessage(
        "Something went wrong. Make sure the backend is running."
      );
    }

    setLoading(false);
  };

  if (!gig) {
    return (
      <div className="gig-details-page">
        <div className="gig-loading-box">
          <div className="loading-spinner"></div>

          <h2>Loading gig...</h2>

          <p>
            Please wait while we load the service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gig-details-page">

      {/* Background Glow */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="gig-details-container">

        {/* Main Gig Card */}
        <div className="gig-main-card">

          {/* Category */}
          <div className="gig-category-badge">
            {gig.category}
          </div>

          {/* Title */}
          <h1>{gig.title}</h1>

          {/* Freelancer */}
          <div className="gig-freelancer">

            <div className="gig-freelancer-avatar">
              {gig.freelancer?.name
                ? gig.freelancer.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="gig-freelancer-info">

              <span>
                Created by
              </span>

              <strong>
                {gig.freelancer?.name || "Unknown Freelancer"}
              </strong>

            </div>

          </div>

          {/* Description */}
          <div className="gig-section">

            <h2>About this service</h2>

            <p className="gig-description">
              {gig.description}
            </p>

          </div>

          {/* Skills */}
          <div className="gig-section">

            <h2>Skills</h2>

            {gig.skills?.length > 0 ? (
              <div className="gig-skills">

                {gig.skills.map(
                  (skill, index) => (
                    <span
                      className="gig-skill"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p className="gig-empty">
                No skills specified.
              </p>
            )}

          </div>

        </div>

        {/* Side Card */}
        <div className="gig-sidebar">

          <div className="gig-price-card">

            <span className="price-label">
              Starting price
            </span>

            <div className="gig-price">
              ₹{gig.price}
            </div>

            <div className="price-note">
              One-time service
            </div>

            <button
              className="hire-button"
              onClick={handleHire}
              disabled={loading}
            >
              {loading
                ? "Sending Request..."
                : "Hire Freelancer →"}
            </button>

            <button
              className="view-freelancer-button"
              onClick={() => {
                setSelectedFreelancer(
                  gig.freelancer?._id
                );

                setPage("public-profile");
              }}
            >
              View Freelancer Profile
            </button>

            {message && (
              <div className="gig-message">
                {message}
              </div>
            )}

          </div>

          {/* Trust Card */}
          <div className="gig-trust-card">

            <div className="trust-item">
              <span>🛡️</span>

              <div>
                <strong>Secure Hiring</strong>

                <small>
                  Work directly with verified users.
                </small>
              </div>
            </div>

            <div className="trust-item">
              <span>⚡</span>

              <div>
                <strong>Fast Response</strong>

                <small>
                  Connect with freelancers easily.
                </small>
              </div>
            </div>

            <div className="trust-item">
              <span>⭐</span>

              <div>
                <strong>Client Reviews</strong>

                <small>
                  Review your experience after completion.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* Back */}
        <button
          className="gig-back-button"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default GigDetails;