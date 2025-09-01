const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const { pool } = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/receipts', express.static(path.join(__dirname, 'uploads/receipts')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/incomes', require('./routes/incomes'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/summary', require('./routes/summary'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API Expense Tracker fonctionne correctement' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Test de connexion à la base de données avant de démarrer le serveur
async function startServer() {
  try {
    // Test de connexion
    const client = await pool.connect();
    console.log('✅ Connecté à PostgreSQL');
    client.release();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}, Mode: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error.message);
    console.error('Vérifiez que PostgreSQL est démarré et que les paramètres de connexion sont corrects');
    process.exit(1);
  }
}

startServer();
