import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import alunoRoutes from './routes/alunoRoute.js';
import { apiKey } from './lib/middlewares/apiKey.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api/alunos', apiKey, alunoRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
