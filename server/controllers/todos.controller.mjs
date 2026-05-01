import { getTodos, getTodosPaged } from '../repositories/todos.repository.mjs';

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

        res.status(200).json(ok(await getTodosPaged(page, pageSize)));
    } catch (error) {
        console.error("Error reading todos:", error);
        res.status(500).json(fail(500, 'Failed to load todos data.', [error.message]));
    }
}
