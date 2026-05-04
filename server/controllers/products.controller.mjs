import { getProducts } from '../repositories/products.repository.mjs';

function ok(data, message = 'Operation completed successfully') {
    return { status: 'success', code: 200, message, errors: [], data };
}

function fail(code, message, errors = []) {
    return { status: 'error', code, message, errors, data: null };
}

export async function getAllProducts(req, res) {
    try {
        res.status(200).json(ok(await getProducts()));
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json(fail(500, 'Failed to load products data.', [error.message]));
    }
}
