import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import UIPatternsDataTable3 from '../components/uipatterns3/UIPatternsDataTable3.jsx';
import UIPatternsForm3 from '../components/uipatterns3/UIPatternsForm3.jsx';
import {
    getCategoryOptions,
    getInventoryOptions,
    getStatusOptions,
} from '../components/uipatterns3/api.js';
import {
    getOptionLabel,
    getValueId,
} from '../components/uipatterns3/picklistHelper.js';

const createEmptyForm = () => ({
    name: '',
    date: null,
    status: null,
    categories: [],
    inventorySelections: {},
});

const EMPTY_OPTIONS = {
    categoryOptions: [],
    inventoryOptions: [],
    statusOptions: [],
};

const createFormValuesFromRow = (row) => {
    if (!row) return createEmptyForm();

    const inventorySelections = {};
    for (const category of row.categories) {
        if (category.inventory) {
            inventorySelections[getValueId(category.category)] = category.inventory;
        }
    }

    return {
        name: row.name,
        date: row.date ? new Date(row.date) : null,
        status: row.status,
        categories: row.categories.map((category) => category.category),
        inventorySelections,
    };
};

export default function UIPatternsPage3() {
    const {
        data: options = EMPTY_OPTIONS,
        isLoading: isLoadingOptions,
    } = useQuery({
        queryKey: ['ui-patterns-3-options'],
        queryFn: async () => {
            const [categoryOptions, inventoryOptions, statusOptions] = await Promise.all([
                getCategoryOptions(),
                getInventoryOptions(),
                getStatusOptions(),
            ]);

            return { categoryOptions, inventoryOptions, statusOptions };
        },
        // Load lookup options once and keep them cached unless manually refreshed.
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const { categoryOptions, inventoryOptions, statusOptions } = options;

    //NOTE: dont need this when saving to database, 
    const [dataTableRows, setDataTableRows] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const isEditing = editingId !== null;
    const editingRow = useMemo(
        () => dataTableRows.find((row) => row.id === editingId) ?? null,
        [dataTableRows, editingId],
    );
    const initialFormValues = useMemo(
        () => createFormValuesFromRow(editingRow),
        [editingRow],
    );

    const resetForm = () => {
        setEditingId(null);
    };

    const onSave = (form) => {
        const payload = {
            name: form.name,
            date: form.date,
            status: form.status,
            categories: form.categories.map((category) => ({
                category,
                inventory: form.inventorySelections[getValueId(category)] ?? null,
            })),
        };

        console.log("onSave - saved form", payload);

        if (isEditing) {
            setDataTableRows((prev) =>
                prev.map((row) => (row.id === editingId ? { ...row, ...payload } : row)),
            );
        } else {
            const nextId = dataTableRows.length
                ? dataTableRows[dataTableRows.length - 1].id + 1
                : 1;
            setDataTableRows((prev) => [...prev, { id: nextId, ...payload }]);
        }
        resetForm();
    };

    const onEdit = (row) => {
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
                    .map((category) =>
                        getOptionLabel(categoryOptions, category.category, 'description'),
                    )
                    .join(' '),
                inventoryText: row.categories
                    .filter((category) => category.inventory)
                    .map((category) =>
                        getOptionLabel(inventoryOptions, category.inventory, 'description'),
                    )
                    .join(', '),
            })),
        [categoryOptions, dataTableRows, inventoryOptions],
    );

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns 3</h1>

            {!isLoadingOptions && (
                <>
                    <UIPatternsDataTable3
                        dataTableRows={memoDataTableRows}
                        categoryOptions={categoryOptions}
                        inventoryOptions={inventoryOptions}
                        statusOptions={statusOptions}
                        editingId={editingId}
                        isEditing={isEditing}
                        onEdit={onEdit}
                        onDelete={confirmDelete}
                    />

                    <h2 className="text-lg font-semibold mb-3">{isEditing ? 'Edit' : 'Add new'}</h2>

                    <UIPatternsForm3
                        categoryOptions={categoryOptions}
                        inventoryOptions={inventoryOptions}
                        statusOptions={statusOptions}
                        initialValues={initialFormValues}
                        isEditing={isEditing}
                        onSave={onSave}
                        onReset={resetForm}
                    />
                </>
            )}
        </section>
    );
}
