import { getTodos, getTodosPaged } from '../repositories/todos.repository.mjs';
import { ok, fail } from '../lib/response.mjs';
import { parsePagingQuery } from '../lib/paging.mjs';

const SORT_FIELDS = {
    id: 'id',
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    tags: 'tags',
};

export async function getAllTodos(req, res) {
    try {
        const result = parsePagingQuery(req.query, SORT_FIELDS);
        if (result.errors) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', result.errors));
        }
        if (result.skipped) {
            return res.status(200).json(ok(await getTodos()));
        }
        res.status(200).json(ok(await getTodosPaged(result.paging)));
    } catch (error) {
        console.error('Error reading todos:', error);
        res.status(500).json(fail(500, 'Failed to load todos data.', [error.message]));
    }
}
