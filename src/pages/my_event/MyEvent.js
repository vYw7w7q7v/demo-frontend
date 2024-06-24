import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Tabs, Tab, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CardMedia } from '@mui/material';
import axios from 'axios';
import './MyEvent.css';
import ViewGuests from "../../views/my_event/ViewGuests";
import { useApiContext } from "../../context/api/ApiContext";
import { useAuthContext } from "../../context/AuthContext";
import { jwtDecode } from 'jwt-decode';

const StyledTabs = styled(Tabs)({
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ccc',
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFA500',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(6),
  color: 'rgba(0, 0, 0, 0.6)',
  '&.Mui-selected': {
    color: '#FFA500',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

const MyEvent = () => {
  const { apiUrl } = useApiContext();
  const { authToken } = useAuthContext();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [viewGuestsOpen, setViewGuestsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [closedEventsData, setClosedEventsData] = useState([]);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      const organizerId = decodedToken.id;

      axios.get(`${apiUrl}/close-event/get-by-organizer-id`, {
        params: {
          organizerId: organizerId
        },
      })
          .then(response => {
            const eventsWithBase64Images = response.data.map(event => ({
              ...event,
              imageUrl: `data:image/jpeg;base64,${event.image}`,
              datetime: event.date,
              address: event.location,
              title: event.name
            }));
            setClosedEventsData(eventsWithBase64Images);
          })
          .catch(error => {
            console.error('Error fetching closed events:', error);
          });
    }
  }, [authToken, apiUrl]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBoxClick = (event) => {
    setSelectedEventId(event.id);
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setSelectedEventId(null);
  };

  const handleViewGuestsClick = (event, isView) => {
    if (isView) {
      setSelectedEventId(event.id);
      setViewGuestsOpen(true);
    }
  };

  const handleCloseViewGuests = () => {
    setViewGuestsOpen(false);
    setSelectedEventId(null);
  };

  const handleDeleteClick = (event) => {
    setSelectedEventId(event.id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Здесь можно добавить код для удаления мероприятия, используя selectedEventId
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  const myEventsData = [
    { id: 1, title: "Мое Событие 1", imageBase64: "<base64 string>", datetime: "2023-06-01 10:00", address: "Адрес 1" },
    { id: 2, title: "Мое Событие 2", imageBase64: "<base64 string>", datetime: "2023-06-02 11:00", address: "Адрес 2" },
  ];

  const eventsData = selectedTab === 0 ? myEventsData : closedEventsData;

  const selectedEvent = eventsData.find(event => event.id === selectedEventId);

  const handleCreateInvitation = () => {
    navigate('/invitation');
  };

  return (
      <Card className="my-event-container">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <StyledTabs value={selectedTab} onChange={handleTabChange}>
            <StyledTab label="Мои мероприятия" />
            <StyledTab label="Закрытые мероприятия" />
          </StyledTabs>
          <Button
              variant="contained"
              style={{ backgroundColor: '#FFA500', color: 'white', marginRight: '16px' }}
              onClick={handleCreateInvitation}
          >
            Создать приглашение
          </Button>
        </Box>
        <CardContent>
          <Box className="event-boxes">
            {eventsData.map((event, index) => (
                <Box display="flex" flexDirection="column" alignItems="center" className="event-box" key={index}>
                  <Typography gutterBottom variant="h6" component="div" className="my-event-content" style={{ fontFamily: 'Roboto', fontSize: '24px', fontWeight: 'bold' }}>
                    {event.title}
                  </Typography>
                  <Box className="my-event-image-container" sx={{ marginBottom: '10px' }}>
                    <CardMedia
                        component="img"
                        src={event.imageUrl}
                        alt={event.title}
                        className="my-event-image"
                    />
                  </Box>
                  <Typography
                      variant="body2"
                      color="text.secondary"
                      className="my-event-content"
                      onClick={() => handleBoxClick(event)}
                      style={{ fontFamily: 'Roboto', fontSize: '16px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Место и время
                  </Typography>
                  <Button
                      variant="contained"
                      style={{ marginTop: '10px', backgroundColor: '#FFA500', color: 'white' }}
                      onClick={() => selectedTab === 0 ? handleDeleteClick(event) : handleViewGuestsClick(event, true)}
                  >
                    {selectedTab === 1 ? "Смотреть" : "Удалить"}
                  </Button>
                </Box>
            ))}
          </Box>
        </CardContent>
        {selectedEvent && (
            <Dialog open={infoDialogOpen} onClose={handleCloseInfoDialog}>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Место: {selectedEvent.address}
                </DialogContentText>
                <DialogContentText>
                  Дата и время: {selectedEvent.datetime}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInfoDialog} color="primary">Закрыть</Button>
              </DialogActions>
            </Dialog>
        )}
        <ViewGuests open={viewGuestsOpen} onClose={handleCloseViewGuests} eventId={selectedEventId} />
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить это событие?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">Отмена</Button>
            <Button onClick={handleConfirmDelete} color="secondary">Удалить</Button>
          </DialogActions>
        </Dialog>
      </Card>
  );
}

export default MyEvent;
