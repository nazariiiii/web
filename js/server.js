const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'asakura',
    port: 5432,
});

const server = http.createServer((req, res) => {
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Обробка форми
    if (req.url === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async() => {
            const { name, email, shus } = JSON.parse(body); // змінити на shus, якщо потрібно
            await pool.query(
                'INSERT INTO form(name, email, shoes) VALUES($1, $2, $3)', [name, email, shus]
            );
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Дані збережено!');
        });
        return;
    }

    // Віддаємо статичні файли
    let filePath;
    if (req.url === '/' || req.url === '/main.html') {
        filePath = path.join(__dirname, 'html', 'main.html');
    } else {
        filePath = path.join(__dirname, req.url.startsWith('/css') ? req.url : req.url.startsWith('/js') ? req.url : 'html', req.url);
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif'
    };
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(process.env.PORT || 3000, () => console.log('Server running'));