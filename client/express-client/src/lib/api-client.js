const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
    constructor(code, message, errors = []) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.errors = errors;
    }
}

async function request(path, { body, headers, ...options } = {}) {
    const hasBody = body !== undefined;
    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                ...(hasBody && { 'Content-Type': 'application/json' }),
                ...headers,
            },
            body: hasBody ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError('NETWORK_ERROR', `Cannot reach API at ${API_URL}. Is the server running?`);
    }

    const payload = await res.json();

    if (!res.ok || payload.status === 'error') {
        throw new ApiError(
            payload.code ?? res.status,
            payload.message ?? res.statusText,
            payload.errors ?? [],
        );
    }

    return payload.data;
}

export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
