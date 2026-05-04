import { getProducts, getProductsPaged } from '../repositories/products.repository.mjs';
import { ok, fail } from '../lib/response.mjs';
import { parsePagingQuery } from '../lib/paging.mjs';

const SORT_FIELDS = {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
};

export async function getAllProducts(req, res) {
    try {
        const result = parsePagingQuery(req.query, SORT_FIELDS);
        if (result.errors) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', result.errors));
        }
        if (result.skipped) {
            return res.status(200).json(ok(await getProducts()));
        }
        res.status(200).json(ok(await getProductsPaged(result.paging)));
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json(fail(500, 'Failed to load products data.', [error.message]));
    }
}
