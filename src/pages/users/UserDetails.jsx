import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the dynamic user ID from the URL

const UserProfile = () => {
  const { id } = useParams();  // Extract the user ID from the URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://backendv3-wmen.onrender.com/api/users/${id}`);
        setUser(response.data.data[0]); // Assuming the user data is in the `data[0]` array
      } catch (err) {
        setError('Error fetching user details.');
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);  // Re-run effect when `id` changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {user && (
        <div>
          <img src={user.profile?.profilePhoto || 'https://via.placeholder.com/150'} alt="Profile" className="profile-photo" />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Status: {user.status}</p>
          <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>

          <h3>Profile Information</h3>
          <p>Birthday: {user.profile?.birthday}</p>
          <p>Location: {user.profile?.location}</p>
          <p>Skills: {user.profile?.skillSet.join(', ')}</p>
          <p>Industries: {user.profile?.industries.join(', ')}</p>
          <p>Commitment Level: {user.profile?.commitmentLevel}</p>
          <p>Equity Expectation: {user.profile?.equityExpectation}</p>
          <p>Prior Startup Experience: {user.profile?.priorStartupExperience}</p>
          <p>Status: {user.profile?.status}</p>
          <p>Bio: {user.profile?.bio}</p>

          <h3>Education</h3>
          {user.profile?.education.length > 0 ? (
            user.profile?.education.map((education, index) => (
              <div key={index}>
                <p>{education.degree} from {education.institution}</p>
                <p>{education.startDate} - {education.endDate || 'Present'}</p>
              </div>
            ))
          ) : (
            <p>No education information available</p>
          )}

          <h3>Experience</h3>
          {user.profile?.experience.length > 0 ? (
            user.profile?.experience.map((exp, index) => (
              <div key={index}>
                <p>{exp.title} at {exp.company}</p>
                <p>{exp.startDate} - {exp.endDate}</p>
                <p>{exp.description}</p>
              </div>
            ))
          ) : (
            <p>No experience information available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
