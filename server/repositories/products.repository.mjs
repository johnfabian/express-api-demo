import sql from '../lib/sql.mjs';

export async function getProducts() {
    return await sql`
        SELECT id, name, description, price::float8 AS price, stock, category
        FROM products
        ORDER BY id
    `;
}
