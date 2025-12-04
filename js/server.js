const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'asakura',
    port: 5432,
});

const server = http.createServer((req, res) => {
    // CORS заголовки для всіх запитів
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async() => {

            const { name, email, shoes } = JSON.parse(body);
            await pool.query(
                'INSERT INTO form(name, email, shoes) VALUES($1, $2, $3)', [name, email, shoes]
            );
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Дані збережено!');

        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));