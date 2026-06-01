import { useMemo, useState } from 'react';
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

const INVENTORY_OPTIONS = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'not-in-stock', label: 'Not In Stock' },
];

const STATUS_OPTIONS = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
];

let nextCategoryRowId = 1;

const createCategoryRow = (values = {}) => ({
    id: nextCategoryRowId++,
    category: null,
    inventory: null,
    ...values,
});

const createEmptyForm = () => ({
    name: '',
    date: null,
    status: null,
    categoryRows: [createCategoryRow()],
});

const INITIAL_FILTERS = {
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    categoriesText: { value: null, matchMode: FilterMatchMode.CONTAINS },
    inventoryText: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export default function UIPatternsPage2() {
    const [form, setForm] = useState(createEmptyForm);
    const [rows, setRows] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const isEditing = editingId !== null;

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const selectedCategoryCount = form.categoryRows.filter((row) => row.category).length;
    const canAddCategoryRow = form.categoryRows.length < CATEGORY_OPTIONS.length;

    const getCategoryOptions = (rowId) => {
        const selectedCategories = new Set(
            form.categoryRows
                .filter((row) => row.id !== rowId && row.category)
                .map((row) => row.category),
        );

        return CATEGORY_OPTIONS.map((option) => ({
            ...option,
            disabled: selectedCategories.has(option.value),
        }));
    };

    const onCategoryRowChange = (rowId, key, value) => {
        setForm((prev) => ({
            ...prev,
            categoryRows: prev.categoryRows.map((row) => {
                if (row.id !== rowId) return row;
                if (key === 'category') return { ...row, category: value, inventory: null };
                return { ...row, [key]: value };
            }),
        }));
    };

    const addCategoryRow = () => {
        setForm((prev) => ({
            ...prev,
            categoryRows: [...prev.categoryRows, createCategoryRow()],
        }));
    };

    const removeCategoryRow = (rowId) => {
        setForm((prev) => {
            return {
                ...prev,
                categoryRows: prev.categoryRows.filter((row) => row.id !== rowId),
            };
        });
    };

    const onSave = () => {
        const built = {
            name: form.name,
            date: form.date,
            status: form.status,
            categories: form.categoryRows
                .filter((row) => row.category)
                .map((row) => ({
                    category: row.category,
                    inventory: row.inventory ?? null,
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
        setForm(createEmptyForm());
        setEditingId(null);
    };

    const onEdit = (row) => {
        setForm({
            name: row.name,
            date: row.date ? new Date(row.date) : null,
            status: row.status,
            categoryRows: row.categories.length
                ? row.categories.map((c) =>
                      createCategoryRow({
                          category: c.category,
                          inventory: c.inventory ?? null,
                      }),
                  )
                : [createCategoryRow()],
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
    const inventoryLabelFor = (inventory) =>  INVENTORY_OPTIONS.find((option) => option.value === inventory)?.label ?? inventory;
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
        row.categories.map((c) => <div key={c.category}>{labelFor(c.category)}</div>);
    const inventoryBody = (row) =>
        row.categories
            .filter((c) => c.inventory)
            .map((c) => <div key={c.category}>{inventoryLabelFor(c.inventory)}</div>);

    const rowClassName = (row) => (row.id === editingId ? 'ui-patterns-selected-row' : '');

    const enrichedRows = useMemo(
        () =>
            rows.map((r) => ({
                ...r,
                categoriesText: r.categories.map((c) => labelFor(c.category)).join(' '),
                inventoryText: r.categories
                    .filter((c) => c.inventory)
                    .map((c) => inventoryLabelFor(c.inventory))
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

    const canSave = form.name.trim() !== '' && selectedCategoryCount > 0;

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns 2</h1>

            <BlockUI blocked={isEditing} className="mb-5">
                <DataTable
                    className="ui-patterns-table"
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
                        field="inventoryText"
                        header="Inventory"
                        body={inventoryBody}
                        sortable
                        filter
                        filterPlaceholder="Search"
                        showFilterMenu={false}
                    />
                </DataTable>
            </BlockUI>

            <h2 className="text-lg font-semibold mb-3">{isEditing ? 'Edit' : 'Add new'}</h2>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (canSave) onSave();
                }}
            >
                <div className="flex flex-wrap gap-3 mb-5">
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
                </div>

                <div className="flex flex-column gap-3 mb-6">
                    {form.categoryRows.map((categoryRow, index) => (
                        <div key={categoryRow.id} className="flex flex-wrap align-items-end gap-2">
                            <div className="w-12rem">
                                <label className="block mb-2 text-sm font-semibold">Category</label>
                                <Dropdown
                                    value={categoryRow.category}
                                    onChange={(e) =>
                                        onCategoryRowChange(categoryRow.id, 'category', e.value)
                                    }
                                    options={getCategoryOptions(categoryRow.id)}
                                    optionLabel="label"
                                    optionDisabled="disabled"
                                    placeholder="Select category"
                                    showClear
                                    className="w-full p-inputtext-sm"
                                />
                            </div>
                            <div className="w-12rem">
                                <label className="block mb-2 text-sm font-semibold">
                                    Inventory <span className="font-normal">(optional)</span>
                                </label>
                                <Dropdown
                                    value={categoryRow.inventory}
                                    onChange={(e) =>
                                        onCategoryRowChange(categoryRow.id, 'inventory', e.value)
                                    }
                                    options={INVENTORY_OPTIONS}
                                    optionLabel="label"
                                    placeholder="Select inventory"
                                    showClear
                                    className="w-full p-inputtext-sm"
                                />
                            </div>
                            {index === 0 && (
                                <Button
                                    type="button"
                                    icon="pi pi-plus"
                                    rounded
                                    outlined
                                    aria-label="Add category row"
                                    onClick={addCategoryRow}
                                    disabled={!canAddCategoryRow}
                                />
                            )}
                            {index > 0 && (
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    rounded
                                    text
                                    severity="danger"
                                    aria-label="Remove category row"
                                    onClick={() => removeCategoryRow(categoryRow.id)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        label={isEditing ? 'Update' : 'Save'}
                        icon="pi pi-save"
                        disabled={!canSave}
                    />
                    {isEditing && (
                        <Button
                            type="button"
                            label="Cancel"
                            icon="pi pi-times"
                            severity="secondary"
                            outlined
                            onClick={resetForm}
                        />
                    )}
                </div>
            </form>
        </section>
    );
}
