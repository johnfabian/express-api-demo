import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import router from './routes.js';

const app = express();
const port = 3000;
const latencyMs = Number.parseInt(process.env.LATENCY_MS, 10) || 0;

app.use(express.json());

if (latencyMs > 0) {
    app.use((req, res, next) => setTimeout(next, latencyMs));
    console.log(`⏱  Simulating ${latencyMs}ms latency on every request (LATENCY_MS).`);
}

app.use('/swagger-ui/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router);

app.listen(port, () => {
    console.log(`✅ Todo API server running successfully on http://localhost:${port}`);
    console.log(`🔗 Swagger Documentation available at: http://localhost:${port}/swagger-ui/`);
});
