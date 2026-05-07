import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const Product = z.object({
    id:          z.number().int().openapi({ example: 1 }),
    name:        z.string().openapi({ example: 'Wireless Earbuds' }),
    description: z.string().openapi({ example: 'Premium wireless earbuds with active noise cancellation' }),
    price:       z.number().openapi({ example: 19.99 }),
    stock:       z.number().int().openapi({ example: 42 }),
    category:    z.string().openapi({ example: 'Electronics' }),
}).openapi('Product');

export const Products = z.array(Product).openapi('Products');

const ProductsPage = z.object({
    items:      Products,
    total:      z.number().int().openapi({ example: 50 }),
    page:       z.number().int().openapi({ example: 1 }),
    pageSize:   z.number().int().openapi({ example: 10 }),
    totalPages: z.number().int().openapi({ example: 5 }),
}).openapi('ProductsPage');

const ProductsResponse = z.object({
    status:  z.string().openapi({ example: 'success' }),
    code:    z.number().int().openapi({ example: 200 }),
    message: z.string().openapi({ example: 'Operation completed successfully' }),
    errors:  z.array(z.string()).openapi({ example: [] }),
    data:    z.union([Products, ProductsPage]),
}).openapi('ProductsResponse');

const MatchMode = z.enum(['contains', 'notContains', 'startsWith', 'endsWith', 'equals', 'notEquals']);

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

export function registerProductsOpenApi(registry) {
    registry.register('Product', Product);
    registry.register('Products', Products);
    registry.register('ProductsPage', ProductsPage);
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
