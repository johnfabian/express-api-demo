import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';

const dataDir = process.env.PGLITE_DATA_DIR || './data/pgdata';

export const pgl = await PGlite.create(dataDir);

const exists = await pgl.query("SELECT to_regclass('public.todos') AS t");
if (exists.rows[0].t === null) {
    const initSql = fs.readFileSync('./db/init.sql', 'utf8');
    await pgl.exec(initSql);
    console.log('Applied db/init.sql to fresh PGlite cluster');
}
