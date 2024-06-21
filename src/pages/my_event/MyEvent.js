import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Tabs, Tab, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CardMedia } from '@mui/material';
import './MyEvent.css';
import ViewGuests from "../../views/my_event/ViewGuests";

const myEventsData = [
  { id: 1, title: "Мое Событие 1", imageUrl: "/img/event/event_4.jpg", datetime: "2023-06-01 10:00", address: "Адрес 1" },
  { id: 2, title: "Мое Событие 2", imageUrl: "/img/event/event_3.jpg", datetime: "2023-06-02 11:00", address: "Адрес 2" },
];

const closedEventsData = [
  { id: 3, title: "Закрытое Событие 1", imageUrl: "/img/event/event_5.jpg", datetime: "2023-07-01 12:00", address: "Адрес 3" },
  { id: 4, title: "Закрытое Событие 2", imageUrl: "/img/event/event_2.jpg", datetime: "2023-07-02 13:00", address: "Адрес 4" },
];

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
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [viewGuestsOpen, setViewGuestsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

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
                  image={event.imageUrl}
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
                onClick={() => handleViewGuestsClick(event, selectedTab === 0)}
              >
                {selectedTab === 0 ? "Смотреть" : "Выбрать"}
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
    </Card>
  );
}

export default MyEvent;
