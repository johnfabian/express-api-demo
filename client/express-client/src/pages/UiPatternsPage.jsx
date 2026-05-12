import { useMemo, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BlockUI } from 'primereact/blockui';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { FilterMatchMode } from 'primereact/api';

const CATEGORY_OPTIONS = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys' },
];

const SUBCATEGORY_OPTIONS = {
    electronics: [
        { value: 'phones', label: 'Phones' },
        { value: 'laptops', label: 'Laptops' },
        { value: 'tablets', label: 'Tablets' },
        { value: 'headphones', label: 'Headphones' },
    ],
    clothing: [
        { value: 'mens', label: "Men's" },
        { value: 'womens', label: "Women's" },
        { value: 'kids', label: 'Kids' },
        { value: 'accessories', label: 'Accessories' },
    ],
    books: [
        { value: 'fiction', label: 'Fiction' },
        { value: 'non-fiction', label: 'Non-fiction' },
        { value: 'textbooks', label: 'Textbooks' },
        { value: 'comics', label: 'Comics' },
    ],
    sports: [
        { value: 'fitness', label: 'Fitness' },
        { value: 'outdoor', label: 'Outdoor' },
        { value: 'team-sports', label: 'Team Sports' },
        { value: 'water-sports', label: 'Water Sports' },
    ],
    toys: [
        { value: 'educational', label: 'Educational' },
        { value: 'puzzles', label: 'Puzzles' },
        { value: 'action-figures', label: 'Action Figures' },
        { value: 'board-games', label: 'Board Games' },
    ],
};

const STATUS_OPTIONS = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
];

const EMPTY_FORM = {
    name: '',
    date: null,
    status: null,
    categories: [],
    subSelections: {},
};

const INITIAL_FILTERS = {
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    categoriesText: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subcategoriesText: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export default function UiPatternsPage() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [rows, setRows] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const isEditing = editingId !== null;

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const onCategoriesChange = (e) => {
        const next = e.value;
        setForm((prev) => {
            const cleaned = {};
            for (const cat of next) {
                if (prev.subSelections[cat] !== undefined) cleaned[cat] = prev.subSelections[cat];
            }
            return { ...prev, categories: next, subSelections: cleaned };
        });
    };

    const onSubChange = (category, value) => {
        setForm((prev) => ({
            ...prev,
            subSelections: { ...prev.subSelections, [category]: value },
        }));
    };

    const onSave = () => {
        const built = {
            name: form.name,
            date: form.date,
            status: form.status,
            categories: form.categories.map((cat) => ({
                category: cat,
                subcategory: form.subSelections[cat] ?? null,
            })),
        };
        if (isEditing) {
            setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...built } : r)));
        } else {
            const nextId = rows.length ? rows[rows.length - 1].id + 1 : 1;
            setRows((prev) => [...prev, { id: nextId, ...built }]);
        }
        resetForm();
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    const onEdit = (row) => {
        const subSelections = {};
        for (const c of row.categories) {
            if (c.subcategory) subSelections[c.category] = c.subcategory;
        }
        setForm({
            name: row.name,
            date: row.date ? new Date(row.date) : null,
            status: row.status,
            categories: row.categories.map((c) => c.category),
            subSelections,
        });
        setEditingId(row.id);
    };

    const confirmDelete = (event, row) => {
        confirmPopup({
            target: event.currentTarget,
            message: (
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-exclamation-triangle text-2xl text-orange-500" />
                    <div>
                        <div className="font-semibold">Delete this row?</div>
                        <div className="text-sm text-color-secondary">"{row.name}" will be removed.</div>
                    </div>
                </div>
            ),
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptIcon: 'pi pi-trash',
            rejectIcon: 'pi pi-times',
            acceptClassName: 'p-button-danger p-button-sm',
            rejectClassName: 'p-button-text p-button-sm',
            defaultFocus: 'reject',
            accept: () => {
                setRows((prev) => prev.filter((r) => r.id !== row.id));
                if (editingId === row.id) resetForm();
            },
        });
    };

    const labelFor = (cat) => CATEGORY_OPTIONS.find((c) => c.value === cat)?.label ?? cat;
    const subLabelFor = (cat, sub) =>
        SUBCATEGORY_OPTIONS[cat]?.find((s) => s.value === sub)?.label ?? sub;
    const statusLabelFor = (s) => STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;

    const actionsBody = (row) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                rounded
                text
                size="small"
                aria-label="Edit"
                onClick={() => onEdit(row)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                size="small"
                severity="danger"
                aria-label="Delete"
                onClick={(e) => confirmDelete(e, row)}
            />
        </div>
    );
    const dateBody = (row) => (row.date ? new Date(row.date).toLocaleDateString() : '');
    const statusBody = (row) => statusLabelFor(row.status);
    const categoriesBody = (row) =>
        row.categories.map((c) => labelFor(c.category)).join(', ');
    const subcategoriesBody = (row) =>
        row.categories
            .filter((c) => c.subcategory)
            .map((c) => <div key={c.category}>{subLabelFor(c.category, c.subcategory)}</div>);

    const rowClassName = (row) => (row.id === editingId ? 'bg-yellow-100' : '');

    const enrichedRows = useMemo(
        () =>
            rows.map((r) => ({
                ...r,
                categoriesText: r.categories.map((c) => labelFor(c.category)).join(', '),
                subcategoriesText: r.categories
                    .filter((c) => c.subcategory)
                    .map((c) => subLabelFor(c.category, c.subcategory))
                    .join(', '),
            })),
        [rows],
    );

    const statusFilterElement = (options) => (
        <Dropdown
            value={options.value}
            options={STATUS_OPTIONS}
            optionLabel="label"
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Any"
            showClear
            className="p-column-filter p-inputtext-sm"
        />
    );

    const dateFilterElement = (options) => (
        <Calendar
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Date"
            dateFormat="mm/dd/yy"
            className="p-column-filter"
            inputClassName="p-inputtext-sm w-full"
        />
    );

    const canSave = form.name.trim() !== '' && form.categories.length > 0;

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns</h1>

            <BlockUI blocked={isEditing} className="mb-5">
                <DataTable
                    value={enrichedRows}
                    stripedRows
                    emptyMessage="No rows yet."
                    rowClassName={rowClassName}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    filterDisplay="row"
                    filterDelay={300}
                    removableSort
                >
                    <Column header="" body={actionsBody} style={{ width: '7rem' }} />
                    <Column
                        field="name"
                        header="Name"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        showFilterMenu={false}
                    />
                    <Column
                        field="date"
                        header="Date"
                        body={dateBody}
                        sortable
                        filter
                        filterElement={dateFilterElement}
                        showFilterMenu={false}
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusBody}
                        sortable
                        filter
                        filterElement={statusFilterElement}
                        showFilterMenu={false}
                    />
                    <Column
                        field="categoriesText"
                        header="Categories"
                        body={categoriesBody}
                        sortable
                        filter
                        filterPlaceholder="Search"
                        showFilterMenu={false}
                    />
                    <Column
                        field="subcategoriesText"
                        header="Subcategories"
                        body={subcategoriesBody}
                        sortable
                        filter
                        filterPlaceholder="Search"
                        showFilterMenu={false}
                    />
                </DataTable>
            </BlockUI>

            <h2 className="text-lg font-semibold mb-3">{isEditing ? 'Edit' : 'Add new'}</h2>

            <div className="flex flex-wrap gap-3 mb-6">
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Name</label>
                    <InputText
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        placeholder="Enter a name"
                        className="w-full p-inputtext-sm"
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Date</label>
                    <Calendar
                        value={form.date}
                        onChange={(e) => setField('date', e.value)}
                        placeholder="Select a date"
                        className="w-full"
                        inputClassName="p-inputtext-sm w-full"
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Status</label>
                    <Dropdown
                        value={form.status}
                        onChange={(e) => setField('status', e.value)}
                        options={STATUS_OPTIONS}
                        optionLabel="label"
                        placeholder="Select..."
                        showClear
                        className="w-full p-inputtext-sm"
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Product Categories</label>
                    <MultiSelect
                        value={form.categories}
                        onChange={onCategoriesChange}
                        options={CATEGORY_OPTIONS}
                        optionLabel="label"
                        placeholder="Select categories"
                        display="comma"
                        showSelectAll={false}
                        className="w-full p-inputtext-sm"
                    />
                </div>
            </div>

            {form.categories.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                    {form.categories.map((cat) => (
                        <div key={cat} className="w-12rem">
                            <label className="block mb-2 text-sm font-semibold">
                                {labelFor(cat)} <span className="font-normal">(optional)</span>
                            </label>
                            <Dropdown
                                value={form.subSelections[cat] ?? null}
                                onChange={(e) => onSubChange(cat, e.value)}
                                options={SUBCATEGORY_OPTIONS[cat] ?? []}
                                optionLabel="label"
                                placeholder="Select..."
                                showClear
                                className="w-full p-inputtext-sm"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    label={isEditing ? 'Update' : 'Save'}
                    icon="pi pi-save"
                    onClick={onSave}
                    disabled={!canSave}
                />
                {isEditing && (
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        severity="secondary"
                        outlined
                        onClick={resetForm}
                    />
                )}
            </div>
        </section>
    );
}
