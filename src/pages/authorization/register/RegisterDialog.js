import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext'; // Импортируем контекст авторизации

// ** Style
import './RegisterDialog.css';

// ** MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';

const RegisterDialog = ({ open, onClose }) => {
  const { setAuthToken } = useAuthContext();
  const [formData, setFormData] = useState({
    username: '',
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.repeatPassword) {
      alert('Пароли не совпадают');
      return;
    }

    const registrationData = {
      name: formData.username,
      login: formData.login,
      password: formData.password,
      email: formData.email,
    };

    axios.post('http://localhost:8080/auth/sign-up', registrationData)
        .then(response => {
          setAuthToken(response.data.token);
          setSuccessMessage('Вы успешно зарегистрированы!');
          setTimeout(() => {
            setSuccessMessage('');
            onClose();
          }, 3000);
        })
        .catch(error => {
          console.error('There was an error registering the user!', error);
        });
  };

  return (
      <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#fff' } }}>
        <Tooltip title="Закрыть" arrow>
          <IconButton aria-label="Close" onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
            <CloseIcon style={{ color: 'black' }} />
          </IconButton>
        </Tooltip>
        <DialogTitle>
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Arial', fontWeight: 'bold', color: 'black' }}>EventEase</Typography>
          <Typography variant="subtitle1" style={{ color: 'black' }} gutterBottom>Пожалуйста зарегестрируйтесь на нашем сервисе</Typography>
        </DialogTitle>
        <DialogContent>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <Grid container spacing={2} direction="column" alignItems="stretch">
            <Grid item>
              <TextField
                  name="username"
                  label="Имя пользователя"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={formData.username}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: 'black' } }}
                  inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
            <Grid item>
              <TextField
                  name="login"
                  label="Логин"
                  variant="outlined"
                  fullWidth
                  value={formData.login}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: 'black' } }}
                  inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
            <Grid item>
              <TextField
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: 'black' } }}
                  inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
            <Grid item>
              <TextField
                  name="password"
                  label="Пароль"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={formData.password}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: 'black' } }}
                  inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
            <Grid item>
              <TextField
                  name="repeatPassword"
                  label="Повторите пароль"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: 'black' } }}
                  inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
          </Grid>
          <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '20px', backgroundColor: '#FFA500', color: 'white' }} fullWidth>Зарегистрироваться</Button>
        </DialogContent>
      </Dialog>
  );
};

export default RegisterDialog;
