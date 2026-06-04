import { useMemo, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import UIPatternsDataTable3 from '../components/uipatterns3/UIPatternsDataTable3.jsx';
import UIPatternsForm3 from '../components/uipatterns3/UIPatternsForm3.jsx';
import {
    getCategoryLabel,
    getInventoryLabel,
} from '../components/uipatterns3/options.js';
import { picklistHelper } from '../components/uipatterns3/picklistHelper.js';

const createEmptyForm = () => ({
    name: '',
    date: null,
    status: null,
    categories: [],
    inventorySelections: {},
});

export default function UIPatternsPage3() {
    const [form, setForm] = useState(createEmptyForm);

    //NOTE: dont need this when saving to database, 
    const [dataTableRows, setDataTableRows] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const isEditing = editingId !== null;

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const onCategoriesChange = (categories) => {
        const categoryValues = categories.map((category) =>
            picklistHelper.getSelectedValue(category, 'description'),
        );

        setForm((prev) => {
            const selectedIds = new Set(categoryValues.map((category) => String(category.id)));
            const inventorySelections = Object.fromEntries(
                Object.entries(prev.inventorySelections).filter(([categoryId]) =>
                    selectedIds.has(categoryId),
                ),
            );

            return { ...prev, categories: categoryValues, inventorySelections };
        });
    };

    const onInventoryChange = (categoryId, inventory) => {
        setForm((prev) => ({
            ...prev,
            inventorySelections: {
                ...prev.inventorySelections,
                [categoryId]: inventory ?? null,
            },
        }));
    };

    const onCategoryRemove = (categoryToRemove) => {
        const removedId = picklistHelper.getSelectedId(
            categoryToRemove,
            'description',
        );

        setForm((prev) => {
            const categories = prev.categories.filter(
                (category) =>
                    picklistHelper.getSelectedId(category, 'description') !== removedId,
            );
            const inventorySelections = { ...prev.inventorySelections };
            delete inventorySelections[removedId];

            return { ...prev, categories, inventorySelections };
        });
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
            categories: form.categories.map((category) => ({
                category: picklistHelper.getSelectedValue(category, 'description'),
                inventory:
                    form.inventorySelections[
                        picklistHelper.getSelectedId(category, 'description')
                    ] ?? null,
            })),
        };

        console.log("onSave - saved form", savedForm);

        if (isEditing) {
            setDataTableRows((prev) =>
                prev.map((row) => (row.id === editingId ? { ...row, ...savedForm } : row)),
            );
        } else {
            const nextId = dataTableRows.length
                ? dataTableRows[dataTableRows.length - 1].id + 1
                : 1;
            setDataTableRows((prev) => [...prev, { id: nextId, ...savedForm }]);
        }
        resetForm();
    };

    const onEdit = (row) => {
        const inventorySelections = {};
        for (const category of row.categories) {
            if (category.inventory) {
                inventorySelections[
                    picklistHelper.getSelectedId(category.category, 'description')
                ] = category.inventory;
            }
        }

        setForm({
            name: row.name,
            date: row.date ? new Date(row.date) : null,
            status: row.status,
            categories: row.categories.map((category) => category.category),
            inventorySelections,
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
                setDataTableRows((prev) =>
                    prev.filter((existingRow) => existingRow.id !== row.id),
                );
                if (editingId === row.id) resetForm();
            },
        });
    };

    const memoDataTableRows = useMemo(
        () =>
            dataTableRows.map((row) => ({
                ...row,
                categoriesText: row.categories
                    .map((category) => getCategoryLabel(category.category))
                    .join(' '),
                inventoryText: row.categories
                    .filter((category) => category.inventory)
                    .map((category) => getInventoryLabel(category.inventory))
                    .join(', '),
            })),
        [dataTableRows],
    );

    const canSave = form.name.trim() !== '' && form.categories.length > 0;

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns 3</h1>

            <UIPatternsDataTable3
                dataTableRows={memoDataTableRows}
                editingId={editingId}
                isEditing={isEditing}
                onEdit={onEdit}
                onDelete={confirmDelete}
            />

            <h2 className="text-lg font-semibold mb-3">{isEditing ? 'Edit' : 'Add new'}</h2>

            <UIPatternsForm3
                form={form}
                isEditing={isEditing}
                canSave={canSave}
                onCategoriesChange={onCategoriesChange}
                onCategoryRemove={onCategoryRemove}
                onInventoryChange={onInventoryChange}
                onSave={onSave}
                onSetField={setField}
                onReset={resetForm}
            />
        </section>
    );
}
