import app from './app.mjs';

const port = Number.parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
    console.log(`Todo API server running successfully on http://${host}:${port}`);
    console.log(`Swagger Documentation available at: http://${host}:${port}/swagger-ui`);
});
