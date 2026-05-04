import sql from '../lib/sql.mjs';
import { paginate } from '../lib/paging.mjs';

const SELECT = sql`id, name, description, price::float8 AS price, stock, category`;

export async function getProducts() {
    return await sql`SELECT ${SELECT} FROM products ORDER BY id`;
}

export async function getProductsPaged(paging) {
    return await paginate(sql, { table: 'products', select: SELECT, ...paging });
}
