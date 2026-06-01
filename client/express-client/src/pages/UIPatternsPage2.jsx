import { useMemo, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { FilterMatchMode } from 'primereact/api';
import UIPatternsDataTable from '../components/uipatterns2/UIPatternsDataTable.jsx';
import UIPatternsForm from '../components/uipatterns2/UIPatternsForm.jsx';
import {
    CATEGORY_OPTIONS,
    inventoryLabelFor,
    labelFor,
} from '../components/uipatterns2/options.js';

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
        setForm((prev) => ({
            ...prev,
            categoryRows: prev.categoryRows.filter((row) => row.id !== rowId),
        }));
    };

    const resetForm = () => {
        setForm(createEmptyForm());
        setEditingId(null);
    };

    const onSave = () => {
        const savedForm = {
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
            setRows((prev) =>
                prev.map((row) => (row.id === editingId ? { ...row, ...savedForm } : row)),
            );
        } else {
            const nextId = rows.length ? rows[rows.length - 1].id + 1 : 1;
            setRows((prev) => [...prev, { id: nextId, ...savedForm }]);
        }
        resetForm();
    };

    const onEdit = (row) => {
        setForm({
            name: row.name,
            date: row.date ? new Date(row.date) : null,
            status: row.status,
            categoryRows: row.categories.length
                ? row.categories.map((category) =>
                      createCategoryRow({
                          category: category.category,
                          inventory: category.inventory ?? null,
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
                setRows((prev) => prev.filter((existingRow) => existingRow.id !== row.id));
                if (editingId === row.id) resetForm();
            },
        });
    };

    const memoRows = useMemo(
        () =>
            rows.map((row) => ({
                ...row,
                categoriesText: row.categories.map((category) => labelFor(category.category)).join(' '),
                inventoryText: row.categories
                    .filter((category) => category.inventory)
                    .map((category) => inventoryLabelFor(category.inventory))
                    .join(', '),
            })),
        [rows],
    );

    const canSave = form.name.trim() !== '' && selectedCategoryCount > 0;

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns 2</h1>

            <UIPatternsDataTable
                rows={memoRows}
                filters={filters}
                editingId={editingId}
                isEditing={isEditing}
                onEdit={onEdit}
                onDelete={confirmDelete}
                onFilter={(e) => setFilters(e.filters)}
            />

            <h2 className="text-lg font-semibold mb-3">{isEditing ? 'Edit' : 'Add new'}</h2>

            <UIPatternsForm
                form={form}
                isEditing={isEditing}
                canSave={canSave}
                canAddCategoryRow={canAddCategoryRow}
                getCategoryOptions={getCategoryOptions}
                onAddCategoryRow={addCategoryRow}
                onCategoryRowChange={onCategoryRowChange}
                onRemoveCategoryRow={removeCategoryRow}
                onSave={onSave}
                onSetField={setField}
                onReset={resetForm}
            />
        </section>
    );
}
