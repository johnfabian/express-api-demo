import swaggerJsDoc from 'swagger-jsdoc';
import path from 'node:path';

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
        ],
    },
    apis: [
        path.join(import.meta.dirname, '..', 'routes', '*.mjs'),
        path.join(import.meta.dirname, '..', 'models', '*.mjs'),
    ],
};

export const apiSpec = swaggerJsDoc(swaggerJsDocOptions);
