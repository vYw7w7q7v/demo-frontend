import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, useMediaQuery, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Settings } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import axios from 'axios';
import './QrCode.css';
import { useApiContext } from "../../context/api/ApiContext";
import { useAuthContext } from "../../context/AuthContext";
import {jwtDecode} from "jwt-decode";

const QrCode = () => {
  const { apiUrl } = useApiContext();
  const { authToken } = useAuthContext();
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || '');
  const [titleColor, setTitleColor] = useState(localStorage.getItem('titleColor') || '#3f51b5');
  const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || '#555');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [organizerName, setOrganizerName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchEvents = async () => {
      const decodedToken = jwtDecode(authToken);
      const organizerId = decodedToken.id;
      setOrganizerName(decodedToken.name || ''); // Устанавливаем имя организатора из токена

      try {
        const response = await axios.get(`${apiUrl}/close-event/get-by-organizer-id`, {
          params: { organizerId }
        });
        setEvents(response.data);
        setSelectedEvent(response.data[0]?.id || '');
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error);
      }
    };

    fetchEvents();
  }, [apiUrl, authToken]);

  useEffect(() => {
    if (backgroundImage) localStorage.setItem('backgroundImage', backgroundImage);
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem('titleColor', titleColor);
  }, [titleColor]);

  useEffect(() => {
    localStorage.setItem('textColor', textColor);
  }, [textColor]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    handleClose();
  };

  const handleColorChange = (event, setColor) => {
    setColor(event.target.value);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleSendClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSend = async () => {
    try {
      await axios.post(`${apiUrl}/send-invitation`, { email, eventId: selectedEvent });
      alert('Приглашение отправлено!');
      setOpenDialog(false);
    } catch (error) {
      console.error('Ошибка при отправке приглашения:', error);
      alert('Не удалось отправить приглашение');
    }
  };

  const selectedEventData = events.find(event => event.id === selectedEvent) || {};

  return (
      <Card className="main-container-qrcode" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <CardContent className="card-content">
          <IconButton className="settings-button" onClick={handleClick}>
            <Settings />
          </IconButton>
          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
          >
            <MenuItem>
              <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-photo"
                  type="file"
                  onChange={handleFileChange}
              />
              <label htmlFor="upload-photo">
                <Button component="span">
                  Изменить задний фон
                </Button>
              </label>
            </MenuItem>
            <MenuItem>
              <label>
                Изменить цвет заголовка
                <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => handleColorChange(e, setTitleColor)}
                />
              </label>
            </MenuItem>
            <MenuItem>
              <label>
                Изменить цвет основного текста
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleColorChange(e, setTextColor)}
                />
              </label>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth>
                <InputLabel id="select-event-label">Выберите мероприятие</InputLabel>
                <Select
                    labelId="select-event-label"
                    value={selectedEvent}
                    onChange={handleEventChange}
                >
                  {events.map((event) => (
                      <MenuItem key={event.id} value={event.id}>
                        {event.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
          <Typography variant="h4" component="h1" className="title" style={{ color: titleColor }}>
            {selectedEventData.name}
          </Typography>
          <Typography variant="body1" className="description" style={{ color: textColor }}>
            Отсканируйте QR-код для быстрого прохода на событие
          </Typography>
          <div className="event-details" style={{ color: textColor }}>
            <Typography variant="body2">
              <strong>Место:</strong> {selectedEventData.location}
            </Typography>
            <Typography variant="body2">
              <strong>Организатор:</strong> {organizerName}
            </Typography>
            <Typography variant="body2">
              <strong>Дата:</strong> {selectedEventData.date}
            </Typography>
          </div>
          <div className="qr-code-container">
            <QRCode value="https://example.com" size={isMobile ? 200 : 400} />
          </div>
          <Button variant="contained" color="primary" onClick={handleSendClick} style={{ marginTop: '10px', backgroundColor: '#FFA500', }}>
            Отправить
          </Button>
        </CardContent>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Отправить приглашение</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Email адрес"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Отмена
            </Button>
            <Button onClick={handleDialogSend} color="primary">
              Отправить
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
  );
};

export default QrCode;
