import sql from '../lib/sql.mjs';

export async function getTodos() {
    return await sql`SELECT * FROM todos ORDER BY id`;
}

export async function getTodosPaged(page, pageSize, sortColumn = 'id', sortOrder = 'asc') {
    const offset = (page - 1) * pageSize;
    const direction = sortOrder === 'desc' ? sql`DESC` : sql`ASC`;
    const sortExpr = sortColumn === 'id'
        ? sql`id`
        : sql`natural_sort_key(${sql(sortColumn)})`;
    const orderBy = sql`ORDER BY ${sortExpr} ${direction}, id ASC`;
    const [items, count] = await Promise.all([
        sql`SELECT * FROM todos ${orderBy} LIMIT ${pageSize} OFFSET ${offset}`,
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
