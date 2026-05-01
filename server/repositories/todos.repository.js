import fs from 'fs';

const toDosPath = './data/todos.json';

export function getTodos() {
    const toDosData = fs.readFileSync(toDosPath, 'utf8');
    return JSON.parse(toDosData);
}

export function getTodosPaged(page, pageSize) {
    const todos = getTodos();
    const total = todos.length;
    const start = (page - 1) * pageSize;
    const items = todos.slice(start, start + pageSize);
    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
