import { useState } from "react";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

import "./index.css";

function App() {

  const [page, setPage] = useState(() => {

    const token =
      localStorage.getItem("token");

    if (token) {
      return "home";
    }

    return "login";
  });


  const [selectedFreelancer, setSelectedFreelancer] =
    useState(null);


  const [selectedGig, setSelectedGig] =
    useState(null);


  // LOGIN

  if (page === "login") {
    return (
      <Login
        setPage={setPage}
      />
    );
  }


  // REGISTER

  if (page === "register") {
    return (
      <Register
        setPage={setPage}
      />
    );
  }


  // CLIENT DASHBOARD

  if (page === "client-dashboard") {
    return (
      <ClientDashboard
        setPage={setPage}
      />
    );
  }


  // FREELANCER DASHBOARD

  if (page === "freelancer-dashboard") {
    return (
      <FreelancerDashboard
        setPage={setPage}
      />
    );
  }


  // PROFILE

  if (page === "profile") {
    return (
      <Profile
        setPage={setPage}
      />
    );
  }


  // CREATE GIG

  if (page === "create-gig") {
    return (
      <CreateGig
        setPage={setPage}
      />
    );
  }


  // GIG DETAILS

  if (page === "gig-details") {
    return (
      <GigDetails
        gigId={selectedGig}
        setPage={setPage}
        setSelectedFreelancer={
          setSelectedFreelancer
        }
      />
    );
  }


  // PUBLIC PROFILE

  if (page === "public-profile") {
    return (
      <PublicProfile
        freelancerId={
          selectedFreelancer
        }
        setPage={setPage}
      />
    );
  }


  // HOME

  return (
    <Home
      setPage={setPage}
      setSelectedFreelancer={
        setSelectedFreelancer
      }
      setSelectedGig={
        setSelectedGig
      }
    />
  );
}

export default App;