import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Box, CardMedia, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DefaultEventImage from '@mui/material/Avatar';
import './EventSelection.css';
import {useApiContext} from "../../context/api/ApiContext";

const EventSelection = () => {
  const { apiUrl } = useApiContext();
  const [openEventDetails, setOpenEventDetails] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/open-event/get`);
        const eventsWithImages = response.data.map(event => ({
          ...event,
          image: `data:image/jpeg;base64,${event.image}`
        }));
        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Ошибка при загрузке данных событий:', error);
      }
    };

    fetchEvents();
  }, [apiUrl]);

  const handleOpenEventDetails = (event) => {
    setSelectedEvent(event);
    setOpenEventDetails(true);
  };

  const handleOpenImageModal = (image) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  };

  const handleClose = () => {
    setOpenEventDetails(false);
    setOpenImageModal(false);
    setSelectedEvent(null);
    setSelectedImage(null);
    setConfirmDialogOpen(false);
  };

  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleConfirmDialogOpen = (event) => {
    setSelectedEvent(event);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleEventConfirm = () => {
    setEvents(events.filter(e => e.id !== selectedEvent.id));
    handleConfirmDialogClose();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? event.type === filterType : true;
    const matchesDate = filterDate ? event.date.split('T')[0] === filterDate : true;
    return matchesSearchTerm && matchesType && matchesDate;
  });

  return (
      <div>
        <Card style={{ width: '89%', margin: '10px auto' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TextField
                  placeholder="Введите запрос для поиска..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginTop: '10px', flex: 1 }}
              />
              <IconButton onClick={handleFilterOpen} style={{ marginLeft: '10px', marginTop: '10px' }}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
        <div className="events-grid">
          {filteredEvents.map(event => (
              <Card key={event.id} className="event-card">
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography gutterBottom variant="h6" component="div" className="text-content" style={{ fontFamily: 'Roboto', fontSize: '24px', fontWeight: 'bold' }}>
                      {event.name}
                    </Typography>
                    <Box className="image-container" sx={{ marginBottom: '10px' }} onClick={() => handleOpenImageModal(event.image)}>
                      <CardMedia
                          component="img"
                          image={event.image}
                          onError={() => setSelectedImage(DefaultEventImage)}
                          alt={event.name}
                          className="event-image"
                      />
                    </Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        className="text-content"
                        style={{ fontFamily: 'Roboto', fontSize: '16px', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => handleOpenEventDetails(event)}>
                      Место и время
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
          ))}
        </div>
        <Dialog
            open={openEventDetails}
            onClose={handleClose}
            aria-labelledby="event-details-title"
            aria-describedby="event-details-description"
        >
          <DialogTitle id="event-details-title">{selectedEvent ? selectedEvent.name : ''}</DialogTitle>
          <DialogContent>
            <DialogContentText id="event-details-description">
              {selectedEvent && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Место: {selectedEvent.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Дата и время: {new Date(selectedEvent.date).toLocaleString()}
                    </Typography>
                  </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
            open={openImageModal}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
          <Box className="modal-content">
            {selectedImage && (
                <img src={selectedImage} alt="Event" className="modal-image" />
            )}
          </Box>
        </Modal>
        <Dialog
            open={filterOpen}
            onClose={handleFilterClose}
            aria-labelledby="filter-dialog-title"
            aria-describedby="filter-dialog-description"
        >
          <DialogTitle id="filter-dialog-title">Фильтры</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-type-label">Тип события</InputLabel>
              <Select
                  labelId="filter-type-label"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value=""><em>Все</em></MenuItem>
                <MenuItem value="концерт">Концерт</MenuItem>
                <MenuItem value="театр">Театр</MenuItem>
                <MenuItem value="другое">Другое</MenuItem>
              </Select>
            </FormControl>
            <TextField
                label="Дата"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterClose} color="primary">
              Отмена
            </Button>
            <Button onClick={handleFilterApply} color="primary">
              Применить
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
            open={confirmDialogOpen}
            onClose={handleConfirmDialogClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">Подтверждение</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              Вы хотите посетить это мероприятие?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose} color="primary">
              Нет
            </Button>
            <Button onClick={handleEventConfirm} color="primary" autoFocus>
              Да
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default EventSelection;
