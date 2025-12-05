const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth');
const inventarioRoutes = require('./routes/inventario');

// Prefixos corretos
app.use('/auth', authRoutes);
app.use('/inventario', inventarioRoutes);

// Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor rodando corretamente 🚀");
});

// Porta Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend rodando na porta " + PORT);
});
