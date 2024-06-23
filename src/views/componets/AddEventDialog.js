import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from "../../context/AuthContext";
import { useApiContext } from '../../context/api/ApiContext';
import { useCloseEventContext } from '../../context/event/CloseEventContext';
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = ({ value, onClick }) => (
    <TextField
        value={value || 'Выберите дату'}
        onClick={onClick}
        fullWidth
        style={{
          width: window.innerWidth <= 600 ? '100%' : '157%',
          border: 'none',
          outline: 'none',
          padding: '10px',
          boxSizing: 'border-box',
          backgroundColor: 'transparent'
        }}
        InputProps={{ disableUnderline: true }}
    />
);

function AddEventDialog({ open, onClose }) {
  const { closeEvent } = useCloseEventContext();
  const { authToken } = useAuthContext();
  const { apiUrl } = useApiContext();
  const [eventData, setEventData] = useState({
    name_event: '',
    address: '',
    description: '',
    registration: null,
    invitedBy: '',
    selectedDate: null,
    closeEvent: closeEvent,
    photo: null
  });

  useEffect(() => {
    setEventData(prevState => ({
      ...prevState,
      closeEvent: closeEvent
    }));
  }, [closeEvent]);

  const handleClose = () => onClose(false);

  const handleSave = async () => {
    try {
      const decodedToken = jwtDecode(authToken);
      const organizerId = decodedToken.id;

      let url = `${apiUrl}/open-event/create`;
      if (eventData.closeEvent === 1) {
        url = `${apiUrl}/close-event/create`;
      }

      const payload = {
        name: eventData.name_event,
        description: eventData.description || "",
        location: eventData.address,
        date: eventData.selectedDate.toLocaleString(),
        image: eventData.photo || "/img/event/event_2.jpg",
        type: "театр",
        organizerId: organizerId
      };

      await axios.post(url, payload);
      console.log('Данные события успешно отправлены!');
      onClose(false);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setEventData(prevState => ({
      ...prevState,
      selectedDate: date
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 800 * 1024) {
      alert('Размер файла не должен превышать 800 кб');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prevState => ({
          ...prevState,
          photo: reader.result.split(',')[1]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size > 800 * 1024) {
      alert('Размер файла не должен превышать 800 кб');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prevState => ({
          ...prevState,
          photo: reader.result.split(',')[1]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setEventData(prevState => ({
      ...prevState,
      photo: null
    }));
  };

  return (
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Создать событие</DialogTitle>
        <DialogContent>
          <Card variant="outlined">
            <CardContent>
              <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{
                    position: 'relative',
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    padding: '30px',
                    textAlign: 'center',
                    marginBottom: '10px',
                    cursor: 'pointer'
                  }}
              >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    id="photo-upload"
                />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                  {eventData.photo ? (
                      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '200px' }}>
                        <img src={`data:image/jpeg;base64,${eventData.photo}`} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton
                            onClick={handleRemovePhoto}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              padding: '5px'
                            }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                  ) : (
                      'Перетащите сюда фото или нажмите для выбора'
                  )}
                </label>
              </div>
              <TextField
                  autoFocus
                  margin="dense"
                  name="name_event"
                  label="Название события"
                  type="text"
                  fullWidth
                  value={eventData.name_event}
                  onChange={handleChange}
              />
              <TextField
                  margin="dense"
                  name="address"
                  label="Место (Адрес)"
                  type="text"
                  fullWidth
                  value={eventData.address}
                  onChange={handleChange}
              />
              {authToken && (
                  <TextField
                      margin="dense"
                      name="description"
                      label="Описание"
                      type="text"
                      fullWidth
                      multiline
                      rows={6}
                      value={eventData.description}
                      onChange={handleChange}
                  />
              )}
              {authToken && (
                  <div style={{ marginTop: "20px", fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: '#333' }}>
                    <label style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold' }}>Дата и время:</label>
                    <div style={{ borderRadius: '5px', border: '1px solid #ccc', overflow: 'hidden', width: '100%' }}>
                      <DatePicker
                          selected={eventData.selectedDate}
                          onChange={handleDateChange}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          timeCaption="Время"
                          customInput={<CustomInput />}
                          popperPlacement="bottom-start"
                          wrapperClassName="datePickerWrapper"
                          className="datePicker"
                      />
                    </div>
                  </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" style={{ backgroundColor: "#FFA500", marginBottom: "10px" }}>
            Отмена
          </Button>
          <Button onClick={handleSave} variant="contained" style={{ backgroundColor: "#FFA500", marginBottom: "10px", marginRight: "16px"  }}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default AddEventDialog;
