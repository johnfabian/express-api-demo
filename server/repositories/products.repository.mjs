import sql from '../lib/sql.mjs';
import { paginate, buildWhere } from '../lib/paging.mjs';

const SELECT = sql`id, name, description, price::float8 AS price, stock, category`;

export async function getProducts({ filters } = {}) {
    const where = buildWhere(sql, filters);
    return await sql`SELECT ${SELECT} FROM products ${where} ORDER BY id`;
}

export async function getProductsPaged({ paging, filters }) {
    return await paginate(sql, { table: 'products', select: SELECT, filters, ...paging });
}
