import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';
import { useAuthContext } from "../../context/AuthContext";
import { jwtDecode } from 'jwt-decode';

const MyAccount = () => {
  const { authToken } = useAuthContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: '', id: '', login: '', email: '' });

  useEffect(() => {
    if (!authToken) {
      navigate('/');
    } else {
      try {
        const decodedToken = jwtDecode(authToken);
        const { name, id, login, email } = decodedToken;
        setUserInfo({ name, id, login, email });
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
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
              <Avatar alt="User Avatar" src="/img/avatar/avatar_demo.jpg" className="avatar" sx={{ width: 300, height: 300, borderRadius: 0 }} />
            </div>
            <div className="user-details">
              <Typography variant="h4" component="h2">
                {userInfo.name}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {userInfo.email}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Есть проблемы — звони,
                В сердце мрак и огни.
                Я приду, помогу,
                Мы разгоним тьму.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

export default MyAccount;
