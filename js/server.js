const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Підключення до PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'asakura',
    port: 5432,
});

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // POST /submit
    if (req.url === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async() => {
            try {
                const { name, email, shoes } = JSON.parse(body);
                await pool.query(
                    'INSERT INTO form(name, email, shoes) VALUES($1, $2, $3)', [name, email, shus]
                );
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Дані збережено!');
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Помилка сервера');
            }
        });
        return;
    }

    // Віддаємо статичні файли
    let filePath;
    if (req.url === '/' || req.url === '/main.html') {
        filePath = path.join(__dirname, 'html', 'main.html');
    } else if (req.url.startsWith('/css')) {
        filePath = path.join(__dirname, req.url);
    } else if (req.url.startsWith('/js')) {
        filePath = path.join(__dirname, req.url);
    } else if (req.url.startsWith('/html')) {
        filePath = path.join(__dirname, req.url);
    } else {
        res.writeHead(404);
        res.end('Not found');
        return;
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