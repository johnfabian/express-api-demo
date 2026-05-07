import sql from '../lib/sql.mjs';
import { paginate, buildWhere } from '../lib/paging.mjs';

export async function getTodos({ filters, q, qColumns } = {}) {
    const where = buildWhere(sql, filters, q, qColumns);
    return await sql`SELECT * FROM todos ${where} ORDER BY id`;
}

export async function getTodosPaged({ paging, filters, q, qColumns }) {
    return await paginate(sql, { table: 'todos', filters, q, qColumns, ...paging });
}
