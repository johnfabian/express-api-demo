import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import router from './routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/swagger-ui/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router);

app.listen(port, () => {
    console.log(`✅ Todo API server running successfully on http://localhost:${port}`);
    console.log(`🔗 Swagger Documentation available at: http://localhost:${port}/swagger-ui/`);
});
