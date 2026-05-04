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
