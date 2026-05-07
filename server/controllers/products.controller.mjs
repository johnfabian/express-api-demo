import { getProducts, getProductsPaged } from '../repositories/products.repository.mjs';
import { ok, fail } from '../lib/response.mjs';
import { parsePagingQuery, parseFilterQuery } from '../lib/paging.mjs';

const SORT_FIELDS = {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
};

const FILTER_FIELDS = {
    name: { column: 'name', defaultMode: 'contains' },
    description: { column: 'description', defaultMode: 'contains' },
    category: { column: 'category', defaultMode: 'equals' },
};

export async function getAllProducts(req, res) {
    try {
        const pagingResult = parsePagingQuery(req.query, SORT_FIELDS);
        const filterResult = parseFilterQuery(req.query, FILTER_FIELDS);
        const errors = [...(pagingResult.errors ?? []), ...(filterResult.errors ?? [])];
        if (errors.length) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', errors));
        }
        const { filters } = filterResult;
        if (pagingResult.skipped) {
            return res.status(200).json(ok(await getProducts({ filters })));
        }
        res.status(200).json(ok(await getProductsPaged({ paging: pagingResult.paging, filters })));
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json(fail(500, 'Failed to load products data.', [error.message]));
    }
}
