import { api } from '../lib/api-client.js';

function appendFilterParams(params, { filters, q } = {}) {
    if (q) params.set('q', q);
    if (filters) {
        for (const [key, entry] of Object.entries(filters)) {
            if (!entry) continue;
            const value = typeof entry === 'object' ? entry.value : entry;
            if (value === undefined || value === null || value === '') continue;
            params.set(key, value);
            if (typeof entry === 'object' && entry.matchMode) {
                params.set(`${key}MatchMode`, entry.matchMode);
            }
        }
    }
    return params;
}

export function getTodos({ filters, q } = {}) {
    const params = appendFilterParams(new URLSearchParams(), { filters, q });
    const qs = params.toString();
    return api.get(qs ? `/todos?${qs}` : '/todos');
}

export function getTodosPaged(page, pageSize, sortField, sortOrder, { filters, q } = {}) {
    const params = new URLSearchParams({ page, pageSize });
    if (sortField) params.set('sortField', sortField);
    if (sortOrder) params.set('sortOrder', sortOrder);
    appendFilterParams(params, { filters, q });
    return api.get(`/todos?${params.toString()}`);
}
