import React, { useState, useEffect } from 'react';
import { Card, CardContent, Avatar, TextField, Button, Grid, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import './AccountSettings.css';
import { useAuthContext } from "../../context/AuthContext";
import { useApiContext } from "../../context/api/ApiContext";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Typography from "@mui/material/Typography";

const AccountSettings = () => {
  const { authToken } = useAuthContext();
  const { apiUrl } = useApiContext();
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setUsername(decodedToken.name);
      setEmail(decodedToken.email);
      setAvatar(decodedToken.avatar);
    }
  }, [authToken]);

  const handleSave = () => {
    const decodedToken = jwtDecode(authToken);
    const userId = decodedToken.id;
    const login = decodedToken.login;
    const password = decodedToken.password;

    const data = {
      id: userId,
      name: username,
      login: login,
      profileImage: null,
      password: password,
    };

    axios.put(`${apiUrl}/user/update`, data)
        .then(response => {
          setSuccessMessage("Данные успешно сохранены!");
          setSuccessSnackbarOpen(true);
        })
        .catch(error => {
          setErrorMessage("Ошибка при сохранении данных.");
          setErrorSnackbarOpen(true);
        });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        setErrorMessage("Размер файла превышает 800 КБ.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        setErrorMessage("Размер файла превышает 800 КБ.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  return (
      <Card className="account-container">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3} container direction="column" alignItems="center">
              <Avatar
                  alt="Фото профиля"
                  src={avatar}
                  className="avatar"
                  sx={{ width: 400, height: 400, borderRadius: 0, objectFit: 'cover' }}
                  onDrop={handleAvatarDrop}
                  onDragOver={(e) => e.preventDefault()}
              />
              <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
                  Изменить фото
                </Button>
              </label>
              {errorMessage && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errorMessage}
                  </Typography>
              )}
            </Grid>
            <Grid item xs={9}>
              <TextField
                  label="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Сохранить изменения
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={() => {}}>
                    Сбросить
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        {/* Snackbar для отображения ошибки */}
        <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseErrorSnackbar} severity="error">
            {errorMessage}
          </MuiAlert>
        </Snackbar>
        {/* Snackbar для отображения успешного сообщения */}
        <Snackbar open={successSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSuccessSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseSuccessSnackbar} severity="success">
            {successMessage}
          </MuiAlert>
        </Snackbar>
      </Card>
  );
}

export default AccountSettings;
