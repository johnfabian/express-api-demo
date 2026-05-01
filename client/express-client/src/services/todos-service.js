import { api } from '../lib/api.js';

export function getTodos() {
    return api.get('/todos');
}
