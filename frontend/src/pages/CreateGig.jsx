import { useState } from "react";

function CreateGig({ setPage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [skills, setSkills] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not found. Please login again.");
      return;
    }

    if (user?.role !== "freelancer") {
      setMessage("Only freelancers can create gigs.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/gigs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freelancer: userId,
            title,
            description,
            price: Number(price),
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
            category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Gig created successfully! 🎉");

        setTitle("");
        setDescription("");
        setPrice("");
        setSkills("");
        setCategory("Web Development");

        setTimeout(() => {
          setPage("home");
        }, 1200);
      } else {
        setMessage(
          data.message || "Failed to create gig."
        );
      }
    } catch (error) {
      console.log("CREATE GIG ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="create-gig-page">

      {/* Background Glows */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="create-gig-box">

        {/* Header */}
        <div className="create-gig-header">

          <div className="create-gig-icon">
            ✨
          </div>

          <div>
            <h1>Create a Gig</h1>

            <p>
              Showcase your skills and offer your services
              to clients.
            </p>
          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="gig-input-group">

            <label>Gig Title</label>

            <input
              type="text"
              placeholder="I will build a modern React website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <small>
              Create a clear and attractive title for your service.
            </small>

          </div>

          {/* Description */}
          <div className="gig-input-group">

            <label>Description</label>

            <textarea
              placeholder="Describe what you will provide to the client..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              required
            />

            <small>
              Explain your service, experience and what the client
              will receive.
            </small>

          </div>

          {/* Price + Category */}
          <div className="gig-two-column">

            <div className="gig-input-group">

              <label>Price</label>

              <div className="price-input">

                <span>₹</span>

                <input
                  type="number"
                  placeholder="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  required
                />

              </div>

            </div>

            <div className="gig-input-group">

              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="Web Development">
                  Web Development
                </option>

                <option value="UI/UX Design">
                  UI/UX Design
                </option>

                <option value="Data Analytics">
                  Data Analytics
                </option>

                <option value="AI & Machine Learning">
                  AI & Machine Learning
                </option>

                <option value="Mobile Development">
                  Mobile Development
                </option>

                <option value="Content Writing">
                  Content Writing
                </option>

                <option value="Digital Marketing">
                  Digital Marketing
                </option>
              </select>

            </div>

          </div>

          {/* Skills */}
          <div className="gig-input-group">

            <label>Skills</label>

            <input
              type="text"
              placeholder="React, JavaScript, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <small>
              Separate multiple skills using commas.
            </small>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="create-gig-button"
            disabled={loading}
          >
            {loading
              ? "Creating Gig..."
              : "Create Gig ✨"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <div className="create-gig-message">
            {message}
          </div>
        )}

        {/* Back */}
        <button
          className="create-gig-back"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default CreateGig;