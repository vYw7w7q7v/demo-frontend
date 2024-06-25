import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Confirm.css';
import { useApiContext } from "../../context/api/ApiContext";

const Confirm = () => {
    const { apiUrl } = useApiContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const confirm = queryParams.get('confirm');

    const [isValidConfirm, setIsValidConfirm] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('Проверка кода...');

    useEffect(() => {
        const checkConfirmation = async () => {
            if (confirm) {
                try {
                    const response = await axios.get(`${apiUrl}/invitation/verify?code=${confirm}`);
                    if (response.data.valid) {
                        setIsValidConfirm(true);
                        setConfirmationMessage(`Подтвержденный код: ${confirm}`);
                    } else {
                        setIsValidConfirm(false);
                        setConfirmationMessage('Нет доступа к событию');
                    }
                } catch (error) {
                    setIsValidConfirm(false);
                    setConfirmationMessage('Ошибка при проверке кода');
                }
            } else {
                setIsValidConfirm(false);
                setConfirmationMessage('Код подтверждения не найден');
            }
        };

        checkConfirmation();
    }, [confirm, location.search, apiUrl]); // Добавлен location.search и apiUrl в зависимости

    const containerClass = isValidConfirm ? 'confirm-container valid' : 'confirm-container invalid';

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
