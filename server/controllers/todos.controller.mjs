import { getTodos, getTodosPaged } from '../repositories/todos.repository.mjs';
import { ok, fail } from '../lib/response.mjs';
import { parsePagingQuery, parseFilterQuery } from '../lib/paging.mjs';

const SORT_FIELDS = {
    id: 'id',
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    tags: 'tags',
};

const FILTER_FIELDS = {
    title: { column: 'title', defaultMode: 'contains' },
    status: { column: 'status', defaultMode: 'equals' },
    priority: { column: 'priority', defaultMode: 'equals' },
    tags: { column: 'tags', defaultMode: 'contains' },
};

const Q_COLUMNS = ['title', 'status', 'priority', 'tags'];

export async function getAllTodos(req, res) {
    try {
        const pagingResult = parsePagingQuery(req.query, SORT_FIELDS);
        const filterResult = parseFilterQuery(req.query, FILTER_FIELDS, Q_COLUMNS);
        const errors = [...(pagingResult.errors ?? []), ...(filterResult.errors ?? [])];
        if (errors.length) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', errors));
        }
        const { filters, q, qColumns } = filterResult;
        if (pagingResult.skipped) {
            return res.status(200).json(ok(await getTodos({ filters, q, qColumns })));
        }
        res.status(200).json(ok(await getTodosPaged({ paging: pagingResult.paging, filters, q, qColumns })));
    } catch (error) {
        console.error('Error reading todos:', error);
        res.status(500).json(fail(500, 'Failed to load todos data.', [error.message]));
    }
}
