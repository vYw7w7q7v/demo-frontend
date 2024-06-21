import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const initialGuests = [
  { id: 1, name: 'Иван Иванов', willAttend: 'Да' },
  { id: 2, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 3, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 4, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 5, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 6, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 7, name: 'Мария Петрова', willAttend: 'Нет' },
  { id: 8, name: 'Алексей Сидоров', willAttend: 'Да' }
];

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
});

const StyledTable = styled(Table)({
  minWidth: 650,
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#f5f5f5',
});

const StyledTableCellHead = styled(TableCell)({
  fontWeight: 'bold',
});

const StyledTableCell = styled(TableCell)({
  padding: '10px 20px',
});

const StyledIconButton = styled(IconButton)({
  color: '#f44336',
});

const StyledCard = styled(Card)({
  marginTop:'20px',
  marginBottom: '-10px',
  boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
});

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: '#FFA500',
  color: '#fff',
});

const StyledDialogContent = styled(DialogContent)({
  backgroundColor: '#fff',
});

const StyledButton = styled(Button)({
  marginRight: '5px',
  color: '#fff',
  backgroundColor: '#FFA500',
  '&:hover': {
    backgroundColor: '#FF8C00',
  },
});

const ViewGuests = ({ open, onClose, eventId }) => {
  const [guests, setGuests] = useState(initialGuests);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const handleDeleteClick = (guest) => {
    setSelectedGuest(guest);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedGuest(null);
  };

  const handleDeleteConfirm = () => {
    setGuests(guests.filter(guest => guest.id !== selectedGuest.id));
    handleDeleteClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>Список гостей</StyledDialogTitle>
      <StyledDialogContent>
        <StyledCard>
          <CardContent>
            <StyledTableContainer component={Paper}>
              <StyledTable stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCellHead>ФИО</StyledTableCellHead>
                    <StyledTableCellHead>Придет</StyledTableCellHead>
                    <StyledTableCellHead>Действие</StyledTableCellHead>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <StyledTableCell>{guest.name}</StyledTableCell>
                      <StyledTableCell>{guest.willAttend}</StyledTableCell>
                      <StyledTableCell>
                        <StyledIconButton
                          onClick={() => handleDeleteClick(guest)}
                        >
                          <DeleteIcon />
                        </StyledIconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </CardContent>
        </StyledCard>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Закрыть
        </StyledButton>
      </DialogActions>
      </StyledDialogContent>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Вы уверены?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить {selectedGuest?.name} из списка гостей?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Нет
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default ViewGuests;
