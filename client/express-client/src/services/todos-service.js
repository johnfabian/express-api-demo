import { api } from '../lib/api-client.js';

export function getTodos() {
    return api.get('/todos');
}

export function getTodosPaged(page, pageSize, sortField, sortOrder) {
    const params = new URLSearchParams({ page, pageSize });
    if (sortField) params.set('sortField', sortField);
    if (sortOrder) params.set('sortOrder', sortOrder);
    return api.get(`/todos?${params.toString()}`);
}
