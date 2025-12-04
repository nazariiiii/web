const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'asakura',
    port: 5432,
});

// Для обробки JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Віддаємо статичні файли
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Головна сторінка
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'main.html'));
});

// POST форма
app.post('/submit', async(req, res) => {
    const { name, email, shoes } = req.body;
    try {
        await pool.query('INSERT INTO form(name, email, shoes) VALUES($1,$2,$3)', [name, email, shus]);
        res.send('Дані збережено!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
});

// Всі інші сторінки (якщо введеш /cherevyky.html то теж спрацює)
app.get('/*.html', (req, res) => {
    const file = path.join(__dirname, 'html', req.url);
    res.sendFile(file, err => {
        if (err) res.status(404).send('Not found');
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));