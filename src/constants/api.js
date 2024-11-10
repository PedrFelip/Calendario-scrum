const express = require('express');
const db = require('./database'); // Conexão com o banco de dados

const api = express();
api.use(express.json()); // Middleware para interpretar JSON

// Rota para criar um evento
api.post('/api/events', (req, res) => {
    const { title, start_date, end_date, description, user_id, color } = req.body;
    if (!user_id || !title || !start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
    }

    const query = `
        INSERT INTO events (title, start_date, end_date, description, color, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [title, start_date, end_date, description, color, user_id], function (err) {
        if (err) {
            console.error('Erro ao criar evento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar evento.' });
        }
        res.status(200).json({ success: true, id: this.lastID });
    });
});

// Rota para listar eventos de um usuário
api.get('/api/events/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = `SELECT * FROM events WHERE user_id = ?`;
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar eventos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar eventos.' });
        }
        res.status(200).json({ success: true, events: rows });
    });
});

// Rota para atualizar um evento
api.put('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const { title, start_date, end_date, description, user_id, color } = req.body;

    if (!user_id || !title || !start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
    }

    const query = `
        UPDATE events 
        SET title = ?, start_date = ?, end_date = ?, description = ?, color = ? 
        WHERE id = ? AND user_id = ?
    `;

    db.run(query, [title, start_date, end_date, description, color, id, user_id], function (err) {
        if (err) {
            console.error('Erro ao atualizar evento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar evento.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Evento não encontrado ou não pertence ao usuário.' });
        }

        res.status(200).json({ success: true });
    });
});

// Rota para excluir um evento
api.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'ID do usuário é obrigatório.' });
    }

    const query = `DELETE FROM events WHERE id = ? AND user_id = ?`;
    db.run(query, [id, user_id], function (err) {
        if (err) {
            console.error('Erro ao excluir evento:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir evento.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Evento não encontrado ou não pertence ao usuário.' });
        }

        res.status(200).json({ success: true });
    });
});

module.exports = api;
