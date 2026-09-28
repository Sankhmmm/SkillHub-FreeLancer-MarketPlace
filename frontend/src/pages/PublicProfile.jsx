import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function PublicProfile({ freelancerId, setPage }) {
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(
  `${API_URL}/api/auth/profile/${freelancerId}`

    )
      .then((response) => response.json())
      .then((data) => setFreelancer(data))
      .catch((error) =>
        console.log("Error loading profile:", error)
      );

    fetch(
  `${API_URL}/api/reviews/freelancer/${freelancerId}`
)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) =>
        console.log("Error loading reviews:", error)
      );
  }, [freelancerId]);

  if (!freelancer) {
    return (
      <div className="profile-page">
        <div className="public-profile-box">
          <div className="loading-spinner"></div>
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="profile-page">

      {/* Background Glow */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="public-profile-container">

        {/* Profile Header */}
        <div className="public-profile-header">

          <div className="public-avatar">
            {freelancer.name
              ? freelancer.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h1>{freelancer.name}</h1>

          <p className="public-profile-bio">
            {freelancer.bio ||
              "This freelancer hasn't added a bio yet."}
          </p>

          {/* Rating */}
          <div className="rating-summary">

            <div className="rating-number">
              ⭐ {averageRating}
            </div>

            <div className="rating-info">
              <strong>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "Review"
                  : "Reviews"}
              </strong>

              <span>
                Client feedback
              </span>
            </div>

          </div>

        </div>

        {/* Skills */}
        <div className="profile-section">

          <div className="section-title">
            <span>🛠️</span>
            <h2>Skills</h2>
          </div>

          {freelancer.skills?.length > 0 ? (
            <div className="skills-list">
              {freelancer.skills.map(
                (skill, index) => (
                  <span
                    className="skill-badge"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="empty-text">
              No skills added yet.
            </p>
          )}

        </div>

        {/* Reviews */}
        <div className="profile-section">

          <div className="section-title">
            <span>💬</span>
            <h2>Client Reviews</h2>
          </div>

          {reviews.length === 0 ? (
            <div className="no-reviews-box">
              <div className="no-review-icon">
                ⭐
              </div>

              <h3>No reviews yet</h3>

              <p>
                This freelancer hasn't received
                any reviews yet.
              </p>
            </div>
          ) : (
            <div className="public-reviews-list">

              {reviews.map((review) => (
                <div
                  className="public-review-card"
                  key={review._id}
                >

                  <div className="review-top">

                    <div className="client-info">

                      <div className="client-avatar">
                        {review.client?.name
                          ? review.client.name
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <div>
                        <strong>
                          {review.client?.name ||
                            "Client"}
                        </strong>

                        <small>
                          Verified Client
                        </small>
                      </div>

                    </div>

                    <div className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                  </div>

                  <p className="review-comment">
                    "{review.comment}"
                  </p>

                  <small className="review-date">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </small>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Back Button */}
        <button
          className="public-back-button"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default PublicProfile;