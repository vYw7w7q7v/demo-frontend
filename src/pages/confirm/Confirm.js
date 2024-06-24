import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './Confirm.css';

const Confirm = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const confirm = queryParams.get('confirm');

    // Проверяем, если confirm является 16-значным числом
    const isValidConfirm = confirm && confirm.length === 16 && !isNaN(parseInt(confirm));
    const containerClass = isValidConfirm ? 'confirm-container valid' : 'confirm-container invalid';
    const confirmationMessage = isValidConfirm ? `Подтвержденный код: ${confirm}` : 'Нет доступа к событию';

    return (
        <Card className={containerClass}>
            <CardContent>
                <Typography variant="h4" align="center" color="textSecondary" fontWeight="bold">
                    {confirmationMessage}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Confirm;
