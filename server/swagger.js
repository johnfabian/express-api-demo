import swaggerJSDoc from 'swagger-jsdoc';
import { todoPaths } from './models/todos.model.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo List API',
            version: '1.0.0',
            description: 'A simple API to fetch all to-do items from a local JSON file.',
        },
        paths: {
            ...todoPaths,
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
