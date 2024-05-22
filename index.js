const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");

const app = express();
const port = 80;

// Ваш токен Telegram Bot и ID чата
const TELEGRAM_BOT_TOKEN = '6904470937:AAGR2b495cT_PpLCycddClMZs52QyHobk_0';
const TELEGRAM_CHAT_ID_ARTEM = '754544480';
const TELEGRAM_CHAT_ID_ULIA = '6507907137';

const ids = [
    TELEGRAM_CHAT_ID_ARTEM,
    TELEGRAM_CHAT_ID_ULIA,
];

let submissions = []; // Для хранения данных о пользователях

// Middleware для парсинга тела запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// TODO: настроить разрешенные домены

// Обработка POST запроса с формы
app.post('/send-data', (req, res) => {
    const { fullName, phone, email } = req.body;

    // Проверка на дубликат
    const isDuplicate = submissions.some((submission) => {
        return (
          submission.email === email || 
          submission.phone === phone
        );
    });

    if (isDuplicate) {
        return res.status(400).send('Duplicate submission');
    }

    // Сохранение данных
    submissions.push({ fullName, email, phone });

    // Сообщение для бота
    const message = `
        Новая заявка с лендинга чайной:
        ФИО: ${fullName}
        Телефон: ${phone}
        Почта: ${email}
    `;

    // URL для запроса к Telegram API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Отправка сообщения боту в Телеграмм
    Promise.all(
        ids.map(id => axios.post(url, {
            chat_id: id,
            text: message
        }))
    )
    
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log('Server is running');
});