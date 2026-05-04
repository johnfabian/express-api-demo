import sql from '../lib/sql.mjs';
import { paginate } from '../lib/paging.mjs';

export async function getTodos() {
    return await sql`SELECT * FROM todos ORDER BY id`;
}

export async function getTodosPaged(paging) {
    return await paginate(sql, { table: 'todos', ...paging });
}
