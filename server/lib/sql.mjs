import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
    transform: { column: postgres.toCamel },
    max: process.env.EMBED_PGLITE === 'true' ? 1 : 10,
});

export default sql;
