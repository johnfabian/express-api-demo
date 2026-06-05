import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import UIPatternsDataTable2 from '../components/uipatterns2/UIPatternsDataTable2.jsx';
import UIPatternsForm2 from '../components/uipatterns2/UIPatternsForm2.jsx';
import {
    getCategoryOptions,
    getInventoryOptions,
    getStatusOptions,
} from '../lib/ui-patterns-api.js';
import {
    getValueId,
} from '../lib/picklist-helper.js';

const createEmptyForm = () => ({
    name: '',
    date: null,
    status: null,
    categories: [],
    inventorySelections: {},
});

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

export default function UIPatternsPage2() {
    const refAllCategoryOptions = useRef([]);
    const refAllInventoryOptions = useRef([]);
    const refAllStatusOptions = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataTableRows, setDataTableRows] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formVersion, setFormVersion] = useState(0);

    const loadCategoryOptions = useCallback(
        () =>
            getCategoryOptions().then((allCategoryOptions) => {
                refAllCategoryOptions.current = allCategoryOptions;
            }),
        [],
    );

    const loadInventoryOptions = useCallback(
        () =>
            getInventoryOptions().then((allInventoryOptions) => {
                refAllInventoryOptions.current = allInventoryOptions;
            }),
        [],
    );

    const loadStatusOptions = useCallback(
        () =>
            getStatusOptions().then((allStatusOptions) => {
                refAllStatusOptions.current = allStatusOptions;
            }),
        [],
    );

    const initialize = useCallback(async () => {
        setIsLoading(true);

        try {
            await Promise.all([
                loadCategoryOptions(),
                loadInventoryOptions(),
                loadStatusOptions(),
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [loadCategoryOptions, loadInventoryOptions, loadStatusOptions]);

    useEffect(() => {
        const loadOptions = async () => {
            await initialize();
        };

        loadOptions();
    }, [initialize]);

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
        setFormVersion((prev) => prev + 1);
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

    return (
        <section>
            <ConfirmPopup />
            <h1 className="text-2xl font-bold mb-3">UI Patterns 2</h1>

            {!isLoading && (
                <>
                    <UIPatternsDataTable2
                        dataTableRows={dataTableRows}
                        editingId={editingId}
                        isEditing={isEditing}
                        onEdit={onEdit}
                        onDelete={confirmDelete}
                        refAllCategoryOptions={refAllCategoryOptions}
                        refAllInventoryOptions={refAllInventoryOptions}
                        refAllStatusOptions={refAllStatusOptions}
                    />

                    <h2 className="text-lg font-semibold mb-3">
                        {isEditing ? 'Edit' : 'Add new'}
                    </h2>

                    <UIPatternsForm2
                        key={editingId ?? `new-${formVersion}`}
                        initialValues={initialFormValues}
                        isEditing={isEditing}
                        onSave={onSave}
                        onReset={resetForm}
                        refAllCategoryOptions={refAllCategoryOptions}
                        refAllInventoryOptions={refAllInventoryOptions}
                        refAllStatusOptions={refAllStatusOptions}
                    />
                </>
            )}
        </section>
    );
}
