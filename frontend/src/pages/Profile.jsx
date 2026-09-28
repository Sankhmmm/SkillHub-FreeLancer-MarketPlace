import { useState } from "react";

function Profile({ setPage }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(
    user?.skills?.join(", ") || ""
  );

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            bio,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setMessage("Profile updated successfully! ✓");
      } else {
        setMessage(
          data.message || "Failed to update profile."
        );
      }
    } catch (error) {
      console.log("PROFILE UPDATE ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }
  };

  return (
    <div className="profile-page">

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="profile-box">

        {/* Profile Avatar */}
        <div className="profile-avatar">
          {name
            ? name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-heading">
          <h1>My Profile</h1>

          <p>
            Manage your SkillHub profile and showcase your skills.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="profile-input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div className="profile-input-group">
            <label>About You</label>

            <textarea
              placeholder="Tell clients about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="5"
            />
          </div>

          {/* Skills */}
          <div className="profile-input-group">
            <label>Skills</label>

            <input
              type="text"
              placeholder="React, Python, SQL, Data Analytics"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <small>
              Separate your skills using commas.
            </small>
          </div>

          {/* Save */}
          <button
            type="submit"
            className="profile-save-button"
          >
            Save Profile
          </button>

        </form>

        {/* Message */}
        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        {/* Back */}
        <button
          className="profile-back-button"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default Profile;