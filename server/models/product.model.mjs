import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { BasePaging, BaseResponseZod } from './base-response-zod.model.mjs';

extendZodWithOpenApi(z);

// Entity model — the Product domain object as returned by the API.
export const Product = z.object({
    id:          z.number().int().openapi({ example: 1 }),
    name:        z.string().openapi({ example: 'Wireless Earbuds' }),
    description: z.string().openapi({ example: 'Premium wireless earbuds with active noise cancellation' }),
    price:       z.number().openapi({ example: 19.99 }),
    stock:       z.number().int().openapi({ example: 42 }),
    category:    z.string().openapi({ example: 'Electronics' }),
}).openapi('Product');

// Paged response shape — extends BasePaging (total/page/pageSize/totalPages) with the items array.
const Products = BasePaging.extend({
    items: z.array(Product),
}).openapi('Products');

// Full HTTP envelope — extends BaseResponseZod (status/code/message/errors) with the data payload.
// data is either a flat array (no paging) or a paged Products object.
const ProductsResponse = BaseResponseZod.extend({
    data: z.union([z.array(Product), Products]),
}).openapi('ProductsResponse');

// Match-mode enum reused across every filter field.
const MatchMode = z.enum(['contains', 'notContains', 'startsWith', 'endsWith', 'equals', 'notEquals']);

// Query parameters accepted by GET /products — paging, sorting, filtering.
const ProductsQuery = z.object({
    page:      z.string().optional().openapi({ description: 'Page number (1-indexed). Requires pageSize.' }),
    pageSize:  z.string().optional().openapi({ description: 'Items per page. Omit to return all products.' }),
    sortField: z.enum(['id', 'name', 'description', 'category']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    name:                 z.string().optional().openapi({ description: 'Filter by name.' }),
    nameMatchMode:        MatchMode.optional().openapi({ description: 'Match mode for name filter (default: contains).' }),
    description:          z.string().optional().openapi({ description: 'Filter by description.' }),
    descriptionMatchMode: MatchMode.optional().openapi({ description: 'Match mode for description filter (default: contains).' }),
    category:             z.string().optional().openapi({ description: 'Filter by category.' }),
    categoryMatchMode:    MatchMode.optional().openapi({ description: 'Match mode for category filter (default: equals).' }),
});

// Wires the schemas above into the OpenAPI registry consumed by middleware/swagger.mjs.
export function registerProductsOpenApi(registry) {
    registry.register('BaseResponseZod', BaseResponseZod);
    registry.register('BasePaging', BasePaging);
    registry.register('Product', Product);
    registry.register('Products', Products);
    registry.register('ProductsResponse', ProductsResponse);

    registry.registerPath({
        method: 'get',
        path: '/products',
        tags: ['Products'],
        summary: 'Get products (with optional server-side paging)',
        description: 'Returns all products when no paging params are supplied. When `pageSize` is provided, returns a single page along with pagination metadata.',
        request: { query: ProductsQuery },
        responses: {
            200: {
                description: 'Either the full list of products or a single page, wrapped in the base response envelope.',
                content: { 'application/json': { schema: ProductsResponse } },
            },
            400: {
                description: 'Invalid query parameters.',
            },
        },
    });
}
