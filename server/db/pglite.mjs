import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';

const dataDir = process.env.PGLITE_DATA_DIR || './data/pgdata';

export const pgl = await PGlite.create(dataDir);

async function ensureTable(table, sqlFile) {
    const result = await pgl.query(`SELECT to_regclass('public.${table}') AS t`);
    if (result.rows[0].t === null) {
        await pgl.exec(fs.readFileSync(sqlFile, 'utf8'));
        console.log(`Applied ${sqlFile} for fresh '${table}' table`);
    }
}

await ensureTable('todos', './db/init.sql');
await ensureTable('products', './db/products.sql');

await pgl.exec(`
    CREATE OR REPLACE FUNCTION natural_sort_key(s text) RETURNS text AS $$
        SELECT COALESCE(string_agg(
            CASE WHEN part ~ '^\\d' THEN lpad(part, 20, '0') ELSE part END,
            '' ORDER BY ord
        ), '')
        FROM regexp_matches(COALESCE(s, ''), '\\d+|\\D+', 'g')
            WITH ORDINALITY AS t(m, ord),
            LATERAL (SELECT m[1] AS part) p;
    $$ LANGUAGE SQL IMMUTABLE;
`);
