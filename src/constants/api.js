const express = require('express');
const db = require('./database'); // Conexão com o banco de dados

const api = express();
api.use(express.json());

// Rota para criar um evento
api.post('/api/events', (req, res) => {
  const { title, start_date, end_date, description } = req.body;
  const query = `INSERT INTO events (title, start_date, end_date, description) VALUES (?, ?, ?, ?)`;
  db.run(query, [title, start_date, end_date, description], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao criar evento' });
    }
    res.status(200).json({ success: true, id: this.lastID });
  });
});

// Rota para listar eventos
api.get('/api/events', (req, res) => {
  const query = `SELECT * FROM events`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar eventos' });
    }
    res.status(200).json({ success: true, events: rows });
  });
});

module.exports = api;
