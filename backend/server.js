const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const inventarioRoutes = require('./routes/inventario');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/inventario', inventarioRoutes);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Servidor rodando corretamente 🚀");
});

app.listen(PORT, () => {
  console.log("Backend rodando na porta " + PORT);
});
