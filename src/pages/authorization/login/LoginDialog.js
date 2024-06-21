// components/LoginDialog.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import { useApiContext } from '../../../context/api/ApiContext';
import axios from 'axios';

// ** Style
import './LoginDialog.css';

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
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

// ** Components
import RegisterDialog from '../register/RegisterDialog';

const LoginDialog = ({ open, onClose }) => {
  const { setAuthToken } = useAuthContext();
  const { apiUrl } = useApiContext();
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
      onClose();
    }
  }, [setAuthToken, onClose]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/sign-in`, {
        login: username,
        password: password
      });

      if (response.data.token) {
        const generatedToken = response.data.token;
        setAuthToken(generatedToken);
        if (rememberMe) {
          localStorage.setItem('authToken', generatedToken);
        }
        onClose();
      } else {
        alert('Неверное имя пользователя или пароль');
      }
    } catch (error) {
      alert('Ошибка при входе. Попробуйте еще раз.');
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleCreateAccountClick = () => {
    setRegisterDialogOpen(true);
    onClose();
  };

  return (
      <>
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#fff' } }}>
          <Tooltip title="Закрыть" arrow>
            <IconButton aria-label="Close" onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
              <CloseIcon style={{ color: 'black' }} />
            </IconButton>
          </Tooltip>
          <DialogTitle>
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'Arial', fontWeight: 'bold', color: 'black' }}>EventEase</Typography>
            <Typography variant="h5" gutterBottom style={{ color: 'black' }}>Добро пожаловать в EventEase!</Typography>
            <Typography variant="subtitle1" gutterBottom style={{ color: 'black' }}>Пожалуйста войдите в свой аккаунт</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} direction="column" alignItems="stretch">
              <Grid item>
                <TextField
                    label="Логин"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ style: { color: 'black' } }}
                    inputProps={{ style: { color: 'black' } }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ style: { color: 'black' } }}
                    inputProps={{ style: { color: 'black' } }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item container alignItems="center">
                <Grid item>
                  <Checkbox checked={rememberMe} onChange={handleRememberMeChange} style={{ color: 'black' }}/>
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{ color: 'black' }}>Запомнить меня</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 'auto' }}>
                  <Typography variant="body2" style={{ color: 'black' }}><a href="#" style={{ color: '#FFA500' }}>Забыли пароль?</a></Typography>
                </Grid>
              </Grid>
            </Grid>
            <Button variant="contained" style={{ marginTop: '10px', backgroundColor: '#FFA500', color: 'white' }} onClick={handleLogin} fullWidth>Войти</Button>
            <Typography variant="body2" style={{ marginTop: '10px', color: 'black' }}>Первый раз у нас? <a href="#" onClick={handleCreateAccountClick} style={{ color: '#FFA500' }}>Создать аккаунт</a></Typography>
          </DialogContent>
        </Dialog>
        <RegisterDialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} />
      </>
  );
};

export default LoginDialog;
