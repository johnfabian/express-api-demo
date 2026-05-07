import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { apiSpec } from './middleware/swagger.mjs';
import todosRouter from './routes/todos-routes.mjs';
import productsRouter from './routes/products-routes.mjs';

const app = express();
const latencyMs = Number.parseInt(process.env.API_SIMULATED_LATENCY, 10) || 0;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

if (latencyMs > 0) {
    app.use((req, res, next) => setTimeout(next, latencyMs));
    console.log(`Simulating ${latencyMs}ms latency on every request (API_SIMULATED_LATENCY).`);
}

//use swagger
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiSpec));

//routes
app.use('/', todosRouter);
app.use('/', productsRouter);

export default app;
