import app from './app.mjs';

const port = Number.parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || 'localhost';

let pgl;
let bridge;

if (process.env.EMBED_PGLITE === 'true') {
    ({ pgl } = await import('./db/pglite.mjs'));
    const { startSocketBridge } = await import('./db/socket.mjs');
    bridge = await startSocketBridge();
}

const httpServer = app.listen(port, () => {
    console.log(`App API server running successfully on http://${host}:${port}`);
    console.log(`Swagger Documentation available at: http://${host}:${port}/swagger-ui`);
});

let shuttingDown = false;
async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\nReceived ${signal}, shutting down...`);

    await new Promise((resolve) => httpServer.close(resolve));
    if (bridge) await bridge.stop();
    if (pgl) await pgl.close();

    process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
