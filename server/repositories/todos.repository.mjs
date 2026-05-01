import sql from '../lib/sql.mjs';

export async function getTodos() {
    return await sql`SELECT * FROM todos ORDER BY id`;
}

export async function getTodosPaged(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const [items, count] = await Promise.all([
        sql`SELECT * FROM todos ORDER BY id LIMIT ${pageSize} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS total FROM todos`,
    ]);
    const total = count[0].total;
    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
