import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ token }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/profile",
        { name: profile.name, email: profile.email, bio: profile.bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  // Handle profile picture update
  const handlePictureUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/profile/picture",
        { profilePic: profile.profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile picture updated!");
    } catch (err) {
      setError("Failed to update picture");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        
        <div>
          <label>Bio:</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
        
        <button type="submit">Update Profile</button>
      </form>

      <form onSubmit={handlePictureUpdate}>
        <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            value={profile.profilePic}
            onChange={(e) => setProfile({ ...profile, profilePic: e.target.value })}
          />
        </div>
        <button type="submit">Update Picture</button>
      </form>
      
      {profile.profilePic && (
        <div className="profile-pic-preview">
          <img src={profile.profilePic} alt="Profile" width="100" />
        </div>
      )}
    </div>
  );
};

export default Profile;