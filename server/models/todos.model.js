export const todoSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        status: { type: 'string' },
        assignedTo: { type: 'string' },
        dueDate: { type: 'string' }
    }
};

export const todoPaths = {
    '/todos': {
        get: {
            summary: 'Get to-do items (with optional server-side paging)',
            description: 'Returns all to-do items when no paging params are supplied. When `pageSize` is provided, returns a single page along with pagination metadata.',
            parameters: [
                {
                    name: 'pageSize',
                    in: 'query',
                    required: false,
                    description: 'Number of items per page. Omit to return all items.',
                    schema: { type: 'integer', minimum: 1 }
                },
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    description: 'Page number (1-indexed). Defaults to 1 when `pageSize` is provided. Requires `pageSize`.',
                    schema: { type: 'integer', minimum: 1 }
                }
            ],
            responses: {
                '200': {
                    description: 'Either a full list of todos (no paging) or a single page with metadata.',
                    content: {
                        'application/json': {
                            schema: {
                                oneOf: [
                                    { type: 'array', items: todoSchema },
                                    {
                                        type: 'object',
                                        properties: {
                                            items: { type: 'array', items: todoSchema },
                                            total: { type: 'integer' },
                                            page: { type: 'integer' },
                                            pageSize: { type: 'integer' },
                                            totalPages: { type: 'integer' }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                '400': { description: 'Invalid page or pageSize query parameter.' }
            }
        }
    }
};
