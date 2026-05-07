import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';

export const STATUS_OPTIONS = [
    { label: 'Not-Started', value: 'Not-Started' },
    { label: 'In-Progress', value: 'In-Progress' },
    { label: 'Completed', value: 'Completed' },
];

export const PRIORITY_OPTIONS = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
];

export const INITIAL_FILTERS = {
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    priority: { value: null, matchMode: FilterMatchMode.EQUALS },
    tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export function dropdownFilterElement(options, dropdownOptions, placeholder) {
    return (
        <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder={placeholder}
            showClear
            className="p-column-filter"
            style={{ minWidth: '10rem' }}
        />
    );
}

export function toApiFilters(filters) {
    const out = {};
    for (const [key, entry] of Object.entries(filters)) {
        if (entry?.value !== null && entry?.value !== undefined && entry?.value !== '') {
            out[key] = { value: entry.value, matchMode: entry.matchMode };
        }
    }
    return out;
}
