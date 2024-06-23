import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';
import { useAuthContext } from "../../context/AuthContext";
import { jwtDecode } from 'jwt-decode';

const MyAccount = () => {
  const { authToken } = useAuthContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: '', id: '', login: '', email: '', avatarUrl: '' }); // Add avatarUrl to userInfo state

  useEffect(() => {
    if (!authToken) {
      navigate('/');
    } else {
      try {
        const decodedToken = jwtDecode(authToken);
        const { name, id, login, email, avatarUrl } = decodedToken; // Assuming avatarUrl is included in the JWT token
        setUserInfo({ name, id, login, email, avatarUrl });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [authToken, navigate]);

  if (!authToken) {
    return null;
  }

  return (
      <Card className="account-container">
        <CardContent>
          <div className="account-info">
            <div className="avatar-container">
              <Avatar
                  alt="User Avatar"
                  src={userInfo.avatarUrl || ''} // Use avatarUrl from state if available, otherwise fallback
                  className="avatar"
                  sx={{ width: 300, height: 300, borderRadius: 0 }}
              />
            </div>
            <div className="user-details">
              <Typography variant="h4" component="h2">
                {userInfo.name}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {userInfo.email}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

export default MyAccount;
