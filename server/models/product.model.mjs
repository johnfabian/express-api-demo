import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const Product = z.object({
    id:          z.number().int().openapi({ example: 1 }),
    name:        z.string().openapi({ example: 'Product 1' }),
    description: z.string().openapi({ example: 'High-quality item number 1' }),
    price:       z.number().openapi({ example: 19.99 }),
    stock:       z.number().int().openapi({ example: 42 }),
    category:    z.string().openapi({ example: 'Electronics' }),
}).openapi('Product');

export const Products = z.array(Product).openapi('Products');

const ProductsResponse = z.object({
    status:   z.string().openapi({ example: 'success' }),
    code:     z.number().int().openapi({ example: 200 }),
    message:  z.string().openapi({ example: 'Operation completed successfully' }),
    errors:   z.array(z.string()).openapi({ example: [] }),
    data:     Products,
}).openapi('ProductsResponse');

export function registerProductsOpenApi(registry) {
    registry.register('Product', Product);
    registry.register('Products', Products);
    registry.register('ProductsResponse', ProductsResponse);

    registry.registerPath({
        method: 'get',
        path: '/products',
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Returns the full list of products.',
        responses: {
            200: {
                description: 'List of products wrapped in the base response envelope.',
                content: {
                    'application/json': { schema: ProductsResponse },
                },
            },
        },
    });
}
