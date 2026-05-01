import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { pgl } from './pglite.mjs';

export async function startSocketBridge() {
    const port = Number(process.env.PG_BRIDGE_PORT) || 5432;
    const host = process.env.PG_BRIDGE_HOST || '127.0.0.1';

    const server = new PGLiteSocketServer({ db: pgl, port, host });
    await server.start();
    console.log(`PGlite bridge listening on ${host}:${port}`);
    return server;
}
