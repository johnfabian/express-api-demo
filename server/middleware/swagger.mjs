import swaggerJsDoc from 'swagger-jsdoc';
import path from 'node:path';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerProductsOpenApi } from '../models/product.model.mjs';

const swaggerJsDocOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo List API',
            version: '1.0.0',
            description: 'A simple API for to-do items, backed by PGlite (embedded Postgres). Demonstrates server-side paging.',
        },
        tags: [
            { name: 'Todos', description: 'To-do operations' },
            { name: 'Products', description: 'Product operations' },
        ],
    },
    apis: [
        path.join(import.meta.dirname, '..', 'routes', '*.mjs'),
        path.join(import.meta.dirname, '..', 'models', '*.mjs'),
    ],
};

const yamlSpec = swaggerJsDoc(swaggerJsDocOptions);

const registry = new OpenAPIRegistry();
registerProductsOpenApi(registry);
const zodSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: '3.0.0',
    info: { title: 'App API', version: '1.0.0' },
});

export const apiSpec = {
    ...yamlSpec,
    paths: { ...(yamlSpec.paths ?? {}), ...(zodSpec.paths ?? {}) },
    components: {
        ...(yamlSpec.components ?? {}),
        schemas: {
            ...(yamlSpec.components?.schemas ?? {}),
            ...(zodSpec.components?.schemas ?? {}),
        },
    },
};
