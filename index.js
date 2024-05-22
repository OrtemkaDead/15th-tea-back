const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");

const app = express();
const port = 80;

// Ваш токен Telegram Bot и ID чата
const TELEGRAM_BOT_TOKEN = '6904470937:AAGR2b495cT_PpLCycddClMZs52QyHobk_0';
const TELEGRAM_CHAT_ID = '754544480';
// const TELEGRAM_CHAT_ID = '6507907137';

// Middleware для парсинга тела запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// настроить разрешенные домены

// Обработка POST запроса с формы
app.post('/send-data', (req, res) => {
    const { fullName, phone, email } = req.body;

    const message = `
        Новая заявка с лендинга чайной:
        ФИО: ${fullName}
        Телефон: ${phone}
        Почта: ${email}
    `;

    // URL для запроса к Telegram API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Отправка сообщения боту в Телеграмм
    axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    })
    .then(response => {
        console.log('Message sent to Telegram');
        res.status(200).send('Спасибо за заполнение формы 😀');
    })
    .catch(error => {
        console.error('Error sending message:', error);
        res.status(500).send('Произошла ошибка при отправке сообщения');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});