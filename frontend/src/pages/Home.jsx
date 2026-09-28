import { useEffect, useState } from "react";

function Home({
  setPage,
  setSelectedFreelancer,
  setSelectedGig,
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [freelancers, setFreelancers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/freelancers")
      .then((response) => response.json())
      .then((data) => setFreelancers(data))
      .catch((error) =>
        console.log("Error loading freelancers:", error)
      );
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/gigs")
      .then((response) => response.json())
      .then((data) => setGigs(data))
      .catch((error) =>
        console.log("Error loading gigs:", error)
      );
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      const reviewData = {};

      for (const freelancer of freelancers) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/reviews/freelancer/${freelancer._id}`
          );

          const data = await response.json();

          if (response.ok) {
            reviewData[freelancer._id] = data;
          }
        } catch (error) {
          console.log(
            "Error loading freelancer reviews:",
            error
          );
        }
      }

      setReviews(reviewData);
    };

    if (freelancers.length > 0) {
      loadReviews();
    }
  }, [freelancers]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setPage("login");
  };

  const filteredGigs = gigs.filter((gig) => {
    const searchText = search.toLowerCase();

    return (
      gig.title?.toLowerCase().includes(searchText) ||
      gig.description?.toLowerCase().includes(searchText) ||
      gig.category?.toLowerCase().includes(searchText) ||
      gig.skills?.some((skill) =>
        skill.toLowerCase().includes(searchText)
      )
    );
  });

  const openDashboard = () => {
    if (user?.role === "client") {
      setPage("client-dashboard");
    } else if (user?.role === "freelancer") {
      setPage("freelancer-dashboard");
    }
  };

  const getAverageRating = (freelancerId) => {
    const freelancerReviews =
      reviews[freelancerId] || [];

    if (freelancerReviews.length === 0) {
      return null;
    }

    const total = freelancerReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (
      total / freelancerReviews.length
    ).toFixed(1);
  };

  const getReviewCount = (freelancerId) => {
    return (reviews[freelancerId] || []).length;
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          SkillHub
        </div>

        <div className="nav-links">

          <span>Find Freelancers</span>

          <span>Projects</span>

          <span>Categories</span>

          <span>
            {user?.name}
          </span>

          {user?.role === "freelancer" && (
            <button
              onClick={() =>
                setPage("create-gig")
              }
            >
              Create Gig
            </button>
          )}

          <button onClick={openDashboard}>
            Dashboard
          </button>

          <button
            onClick={() =>
              setPage("profile")
            }
          >
            My Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      {/* HERO */}

      <section className="hero">

        <h1>
          Find the right freelancer
          <br />
          for your project
        </h1>

        <p>
          Connect with talented freelancers
          and get your projects completed faster.
        </p>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search for skills, services..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button>
            Search
          </button>

        </div>

      </section>

      {/* CATEGORIES */}

      <section className="categories">

        <h2>
          Explore Categories
        </h2>

        <div className="category-grid">

          <div className="category-card">
            💻
            <h3>
              Web Development
            </h3>
            <p>
              Websites & Applications
            </p>
          </div>

          <div className="category-card">
            🎨
            <h3>
              UI/UX Design
            </h3>
            <p>
              Design & Prototyping
            </p>
          </div>

          <div className="category-card">
            📊
            <h3>
              Data Analytics
            </h3>
            <p>
              Data & Business Insights
            </p>
          </div>

          <div className="category-card">
            🤖
            <h3>
              AI & Machine Learning
            </h3>
            <p>
              AI Solutions & Models
            </p>
          </div>

        </div>

      </section>

      {/* GIGS */}

      <section className="freelancers">

        <h2>
          Featured Gigs
        </h2>

        {filteredGigs.length === 0 ? (
          <p>
            No gigs found.
          </p>
        ) : (

          <div className="freelancer-grid">

            {filteredGigs.map((gig) => {

              const rating = getAverageRating(
                gig.freelancer?._id
              );

              const reviewCount =
                getReviewCount(
                  gig.freelancer?._id
                );

              return (

                <div
                  className="freelancer-card"
                  key={gig._id}
                >

                  <div className="avatar">

                    {gig.freelancer?.name
                      ? gig.freelancer.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <h3>
                    {gig.title}
                  </h3>

                  <p>
                    {gig.description}
                  </p>

                  <p>
                    <strong>
                      Freelancer:
                    </strong>{" "}
                    {gig.freelancer?.name ||
                      "Unknown"}
                  </p>

                  {/* RATING */}

                  <div className="card-rating">

                    {rating ? (
                      <>
                        <span>
                          ⭐ {rating}
                        </span>

                        <small>
                          ({reviewCount}{" "}
                          {reviewCount === 1
                            ? "review"
                            : "reviews"})
                        </small>
                      </>
                    ) : (
                      <small>
                        No reviews yet
                      </small>
                    )}

                  </div>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {gig.category}
                  </p>

                  <span>
                    {gig.skills?.length > 0
                      ? gig.skills.join(", ")
                      : "No skills added"}
                  </span>

                  <h3>
                    ₹{gig.price}
                  </h3>

                  <button
                    onClick={() => {
                      setSelectedGig(
                        gig._id
                      );

                      setPage(
                        "gig-details"
                      );
                    }}
                  >
                    View Gig
                  </button>

                </div>

              );
            })}

          </div>

        )}

      </section>

      {/* FREELANCERS */}

      <section className="freelancers">

        <h2>
          Featured Freelancers
        </h2>

        <div className="freelancer-grid">

          {freelancers.length === 0 ? (
            <p>
              No freelancers found.
            </p>
          ) : (

            freelancers.map(
              (freelancer) => {

                const rating =
                  getAverageRating(
                    freelancer._id
                  );

                const reviewCount =
                  getReviewCount(
                    freelancer._id
                  );

                return (

                  <div
                    className="freelancer-card"
                    key={freelancer._id}
                  >

                    <div className="avatar">

                      {freelancer.name
                        ? freelancer.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>

                    <h3>
                      {freelancer.name}
                    </h3>

                    <p>
                      {freelancer.bio ||
                        "Freelancer"}
                    </p>

                    {/* RATING */}

                    <div className="card-rating">

                      {rating ? (
                        <>
                          <span>
                            ⭐ {rating}
                          </span>

                          <small>
                            ({reviewCount}{" "}
                            {reviewCount === 1
                              ? "review"
                              : "reviews"})
                          </small>
                        </>
                      ) : (
                        <small>
                          No reviews yet
                        </small>
                      )}

                    </div>

                    <span>
                      {freelancer.skills
                        ?.length > 0
                        ? freelancer.skills.join(
                            ", "
                          )
                        : "Skills not added yet"}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedFreelancer(
                          freelancer._id
                        );

                        setPage(
                          "public-profile"
                        );
                      }}
                    >
                      View Profile
                    </button>

                  </div>

                );
              }
            )

          )}

        </div>

      </section>

    </div>
  );
}

export default Home;