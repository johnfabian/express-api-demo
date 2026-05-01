import { getTodos, getTodosPaged } from '../repositories/todos.repository.mjs';

export async function getAllTodos(req, res) {
    const hasPageSize = req.query.pageSize !== undefined;
    const hasPage = req.query.page !== undefined;

    try {
        if (!hasPageSize && !hasPage) {
            return res.status(200).json(await getTodos());
        }

        if (!hasPageSize) {
            return res.status(400).json({
                error: "Query param 'pageSize' is required when 'page' is provided.",
            });
        }

        const pageSize = Number.parseInt(req.query.pageSize, 10);
        const page = hasPage ? Number.parseInt(req.query.page, 10) : 1;

        if (!Number.isInteger(pageSize) || pageSize < 1) {
            return res.status(400).json({ error: "Query param 'pageSize' must be a positive integer." });
        }
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({ error: "Query param 'page' must be a positive integer." });
        }

        res.status(200).json(await getTodosPaged(page, pageSize));
    } catch (error) {
        console.error("Error reading todos:", error);
        res.status(500).json({ error: "Failed to load todos data." });
    }
}
