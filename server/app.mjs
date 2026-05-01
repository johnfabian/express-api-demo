import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { apiSpec } from './middleware/swagger.mjs';
import todosRouter from './routes/todos-routes.mjs';

const app = express();
const latencyMs = Number.parseInt(process.env.API_SIMULATED_LATENCY, 10) || 0;

app.use(express.json());

if (latencyMs > 0) {
    app.use((req, res, next) => setTimeout(next, latencyMs));
    console.log(`Simulating ${latencyMs}ms latency on every request (API_SIMULATED_LATENCY).`);
}

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiSpec));
app.use('/', todosRouter);

export default app;
