export function ok(data, message = 'Operation completed successfully') {
    return { status: 'success', code: 200, message, errors: [], data };
}

export function fail(code, message, errors = []) {
    return { status: 'error', code, message, errors, data: null };
}
