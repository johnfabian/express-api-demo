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

// PrimeReact may pass around either the full option or only option.value.
// Normalize both cases to the nested value object used for saved rows.
export const optionValueFor = (selected) =>
    selected && 'value' in selected && 'description' in selected ? selected.value : selected;

export const optionIdFor = (selected) => optionValueFor(selected)?.id;

// Saved rows store value objects, while display names live on the full options.
// Match by id to recover the configured description.
export const optionForValue = (options, selected) => {
    const value = optionValueFor(selected);
    return options.find((option) => option.value.id === value?.id) ?? null;
};

export const optionDisplayFor = (option) => {
    if (!option) return '';
    return option.description;
};

// Use the option description for UI labels, with shortDescription as a fallback
// if a saved value no longer exists in the current option list.
export const valueDisplayFor = (options, selected) => {
    const option = optionForValue(options, selected);
    if (option) return optionDisplayFor(option);

    const value = optionValueFor(selected);
    if (!value) return '';

    return value.shortDescription;
};

export const categoryLabelFor = (category) => valueDisplayFor(CATEGORY_OPTIONS, category);

export const inventoryLabelFor = (inventory) => valueDisplayFor(INVENTORY_OPTIONS, inventory);

export const statusLabelFor = (status) =>
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
