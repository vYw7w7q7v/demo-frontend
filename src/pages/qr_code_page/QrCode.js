import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, useMediaQuery, Select, FormControl, InputLabel } from '@mui/material';
import { Settings } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import './QrCode.css';

const QrCode = () => {
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || '');
  const [titleColor, setTitleColor] = useState(localStorage.getItem('titleColor') || '#3f51b5');
  const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || '#555');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('event1');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const events = {
    event1: {
      title: 'Приглашение на мероприятие 1',
      place: 'Москва, Красная площадь',
      organizer: 'Иван Иванов',
      date: '25 декабря 2024'
    },
    event2: {
      title: 'Приглашение на мероприятие 2',
      place: 'Санкт-Петербург, Невский проспект',
      organizer: 'Анна Антонова',
      date: '1 января 2025'
    },
    event3: {
      title: 'Приглашение на мероприятие 3',
      place: 'Казань, Кремлевская улица',
      organizer: 'Петр Петров',
      date: '15 февраля 2025'
    }
  };

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
                <Select
                    labelId="select-event-label"
                    value={selectedEvent}
                    onChange={handleEventChange}
                >
                  {Object.keys(events).map((eventKey) => (
                      <MenuItem key={eventKey} value={eventKey}>
                        {events[eventKey].title}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
          <Typography variant="h4" component="h1" className="title" style={{ color: titleColor }}>
            {events[selectedEvent].title}
          </Typography>
          <Typography variant="body1" className="description" style={{ color: textColor }}>
            Отсканируйте QR-код для быстрого перехода на страницу события
          </Typography>
          <div className="event-details" style={{ color: textColor }}>
            <Typography variant="body2">
              <strong>Место:</strong> {events[selectedEvent].place}
            </Typography>
            <Typography variant="body2">
              <strong>Организатор:</strong> {events[selectedEvent].organizer}
            </Typography>
            <Typography variant="body2">
              <strong>Дата:</strong> {events[selectedEvent].date}
            </Typography>
          </div>
          <div className="qr-code-container">
            <QRCode value="https://example.com" size={isMobile ? 200 : 400} />
          </div>
        </CardContent>
      </Card>
  );
};

export default QrCode;
