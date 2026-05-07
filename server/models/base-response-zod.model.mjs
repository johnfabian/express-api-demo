import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const BaseResponseZod = z.object({
    status:  z.string().openapi({ example: 'success' }),
    code:    z.number().int().openapi({ example: 200 }),
    message: z.string().openapi({ example: 'Operation completed successfully' }),
    errors:  z.array(z.string()).openapi({ example: [] }),
}).openapi('BaseResponseZod');

export const BasePaging = z.object({
    total:      z.number().int().openapi({ example: 50 }),
    page:       z.number().int().openapi({ example: 1 }),
    pageSize:   z.number().int().openapi({ example: 10 }),
    totalPages: z.number().int().openapi({ example: 5 }),
}).openapi('BasePaging');
