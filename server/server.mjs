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

//create app server
const httpServer = app.listen(port, () => {
    const apiUrl = `http://${host}:${port}`;
    const swaggerUrl = `${apiUrl}/swagger-ui`;
    const clientUrl = process.env.CLIENT_URL;

    console.log('');
    console.log('  ───────────────────────────────────────────');
    if (clientUrl) console.log(`  Client UI:  ${clientUrl}`);
    console.log(`  Server API: ${apiUrl}`);
    console.log(`  Swagger:    ${swaggerUrl}`);
    console.log('  ───────────────────────────────────────────');
    console.log('');
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
