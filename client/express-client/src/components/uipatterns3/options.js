import { picklistHelper } from './picklistHelper.js';

export const CATEGORY_OPTIONS = [
    { description: 'Electronics', value: { id: 1, shortDescription: 'ELEC', active: true } },
    { description: 'Clothing', value: { id: 2, shortDescription: 'CLO', active: true } },
    { description: 'Books', value: { id: 3, shortDescription: 'BOOK', active: false } },
    { description: 'Sports', value: { id: 4, shortDescription: 'SPRT', active: true } },
    { description: 'Toys', value: { id: 5, shortDescription: 'TOY', active: false } },
];

export const INVENTORY_OPTIONS = [
    { description: 'In Stock', value: { id: 1, shortDescription: 'IN', active: true } },
    { description: 'Not In Stock', value: { id: 2, shortDescription: 'OUT', active: true } },
    { description: 'Back Ordered', value: { id: 3, shortDescription: 'BACK', active: false } },
];

export const STATUS_OPTIONS = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
];

export const getCategoryLabel = (category) =>
    picklistHelper.getSelectedLabel(CATEGORY_OPTIONS, category, 'description');

export const getInventoryLabel = (inventory) =>
    picklistHelper.getSelectedLabel(INVENTORY_OPTIONS, inventory, 'description');

export const getStatusLabel = (status) => picklistHelper.getSelectedLabel(STATUS_OPTIONS, status);
