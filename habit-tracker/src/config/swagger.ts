import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Habit Tracker API',
      version: '1.0.0',
      description: `
## 🎯 API de Rastreamento de Hábitos

API RESTful para gerenciamento de hábitos diários com:
- ✅ Autenticação JWT
- ✅ CRUD de hábitos
- ✅ Check-in diário com cálculo de streak
- ✅ Estatísticas e progresso semanal

### Como usar
1. Cadastre um usuário em **/auth/cadastrar**
2. Faça login em **/auth/login** e copie o token
3. Clique em **Authorize** e cole o token no formato: \`Bearer SEU_TOKEN\`
4. Agora você pode usar todos os endpoints protegidos 🔒
      `,
    },
    servers: [
      {
        url: 'https://habit-tracker-api.up.railway.app/api/v1',
        description: 'Servidor de produção',
      },
      {
        url: 'http://localhost:3333/api/v1',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Cole o token JWT obtido no login. Formato: Bearer SEU_TOKEN',
        },
      },
      schemas: {
        Habito: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-aqui' },
            titulo: { type: 'string', example: 'Beber água' },
            descricao: { type: 'string', example: 'Beber 2 litros por dia' },
            cor: { type: 'string', example: '#6366f1' },
            frequencia: { type: 'string', enum: ['DIARIO', 'SEMANAL'] },
            ativo: { type: 'boolean', example: true },
            criadoEm: { type: 'string', format: 'date-time' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-aqui' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@exemplo.com' },
          },
        },
        RespostaErro: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'erro' },
            message: { type: 'string', example: 'Descrição do erro' },
          },
        },
        ResumoEstatisticas: {
          type: 'object',
          properties: {
            totalHabitos: { type: 'integer', example: 5 },
            completadosHoje: { type: 'integer', example: 3 },
            maiorStreak: { type: 'integer', example: 12 },
            taxaConclusao: { type: 'integer', example: 78 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Autenticação',
        description: 'Cadastro e login de usuários',
      },
      {
        name: 'Hábitos',
        description: 'Criação e gerenciamento de hábitos',
      },
      {
        name: 'Check-in',
        description: 'Registro diário de hábitos e cálculo de streak',
      },
      {
        name: 'Estatísticas',
        description: 'Progresso semanal e resumo geral — dados para os gráficos',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);