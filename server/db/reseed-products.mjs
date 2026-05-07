import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';

const dataDir = process.env.PGLITE_DATA_DIR || './data/pgdata';
const pgl = await PGlite.create(dataDir);

await pgl.exec('DROP TABLE IF EXISTS products');
await pgl.exec(fs.readFileSync('./db/products.sql', 'utf8'));

const { rows } = await pgl.query('SELECT count(*)::int AS n FROM products');
console.log(`Reseeded products. Row count: ${rows[0].n}`);

await pgl.close();
