export const CATEGORY_OPTIONS = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys' },
];

export const INVENTORY_OPTIONS = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'not-in-stock', label: 'Not In Stock' },
];

export const STATUS_OPTIONS = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
];

export const labelFor = (category) =>
    CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;

export const inventoryLabelFor = (inventory) =>
    INVENTORY_OPTIONS.find((option) => option.value === inventory)?.label ?? inventory;

export const statusLabelFor = (status) =>
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
