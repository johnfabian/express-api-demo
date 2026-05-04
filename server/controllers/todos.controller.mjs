import { getTodos, getTodosPaged } from '../repositories/todos.repository.mjs';

const SORT_FIELDS = {
    id: 'id',
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    tags: 'tags',
};

function ok(data, message = 'Operation completed successfully') {
    return { status: 'success', code: 200, message, errors: [], data };
}

function fail(code, message, errors = []) {
    return { status: 'error', code, message, errors, data: null };
}

export async function getAllTodos(req, res) {
    const hasPageSize = req.query.pageSize !== undefined;
    const hasPage = req.query.page !== undefined;

    try {

        //get all if paging parameters are not passed
        if (!hasPageSize && !hasPage) {
            return res.status(200).json(ok(await getTodos()));
        }

        if (!hasPageSize) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', [
                "Query param 'pageSize' is required when 'page' is provided.",
            ]));
        }

        const pageSize = Number.parseInt(req.query.pageSize, 10);
        const page = hasPage ? Number.parseInt(req.query.page, 10) : 1;

        if (!Number.isInteger(pageSize) || pageSize < 1) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', [
                "Query param 'pageSize' must be a positive integer.",
            ]));
        }
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', [
                "Query param 'page' must be a positive integer.",
            ]));
        }

        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder;

        if (sortField !== undefined && !Object.hasOwn(SORT_FIELDS, sortField)) {
            return res.status(400).json(fail(400, 'Invalid query parameters.', [
                `Query param 'sortField' must be one of: ${Object.keys(SORT_FIELDS).join(', ')}.`,
            ]));
        }
        if (sortOrder !== undefined && sortOrder !== 'asc' && sortOrder !== 'desc') {
            return res.status(400).json(fail(400, 'Invalid query parameters.', [
                "Query param 'sortOrder' must be 'asc' or 'desc'.",
            ]));
        }

        const sortColumn = sortField ? SORT_FIELDS[sortField] : 'id';
        const order = sortOrder ?? 'asc';

        //get paged
        res.status(200).json(ok(await getTodosPaged(page, pageSize, sortColumn, order)));
    } catch (error) {
        console.error("Error reading todos:", error);
        res.status(500).json(fail(500, 'Failed to load todos data.', [error.message]));
    }
}
