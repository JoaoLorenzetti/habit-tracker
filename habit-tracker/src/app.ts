import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API (serão adicionadas nos próximos commits)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/habits', habitRoutes);

// Handler de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ status: 'erro', message: 'Rota não encontrada' });
});

// Handler de erros (deve ser o último)
app.use(errorHandler);

export default app;
