import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import {
    getOptionLabel,
    getValueId,
} from '../../lib/picklist-helper.js';

const optionTemplate = (option) => (
    <span>{option.description}</span>
);

const selectedInventoryTemplate = (inventoryOptions, value) => {
    if (!value) return <span>Select inventory</span>;
    return <span>{getOptionLabel(inventoryOptions, value, 'description')}</span>;
};

const createEmptyForm = () => ({
    name: '',
    date: null,
    status: null,
    categories: [],
    inventorySelections: {},
});

const pruneInventorySelections = (inventorySelections, selectedCategoryIds) => {
    const nextInventorySelections = {};

    for (const categoryId of selectedCategoryIds) {
        if (inventorySelections[categoryId]) {
            nextInventorySelections[categoryId] = inventorySelections[categoryId];
        }
    }

    return nextInventorySelections;
};

export default function UIPatternsForm2({
    initialValues,
    isEditing,
    onSave,
    onReset,
    refAllCategoryOptions,
    refAllInventoryOptions,
    refAllStatusOptions,
}) {
    const [form, setForm] = useState(initialValues);
    const categoryOptions = refAllCategoryOptions.current;
    const inventoryOptions = refAllInventoryOptions.current;
    const statusOptions = refAllStatusOptions.current;
    const canSave = form.name.trim() !== '' && form.categories.length > 0;

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onCategoriesChange = (nextCategories) => {
        const categoryValues = nextCategories ?? [];
        const selectedCategoryIds = categoryValues.map((category) => String(getValueId(category)));

        setForm((prev) => ({
            ...prev,
            categories: categoryValues,
            inventorySelections: pruneInventorySelections(
                prev.inventorySelections,
                selectedCategoryIds,
            ),
        }));
    };

    const onInventoryChange = (category, value) => {
        const categoryId = String(getValueId(category));

        setForm((prev) => {
            const inventorySelections = { ...prev.inventorySelections };

            if (value) {
                inventorySelections[categoryId] = value;
            } else {
                delete inventorySelections[categoryId];
            }

            return { ...prev, inventorySelections };
        });
    };

    const onCategoryRemove = (categoryToRemove) => {
        const removedId = getValueId(categoryToRemove);

        setForm((prev) => {
            const nextInventorySelections = { ...prev.inventorySelections };
            delete nextInventorySelections[removedId];

            return {
                ...prev,
                categories: prev.categories.filter(
                    (category) => getValueId(category) !== removedId,
                ),
                inventorySelections: nextInventorySelections,
            };
        });
    };

    const resetForm = () => {
        setForm(createEmptyForm());
        onReset();
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (!canSave) return;

        onSave(form);
        setForm(createEmptyForm());
    };

    return (
        <form onSubmit={onSubmit}>
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
                        options={statusOptions}
                        optionLabel="label"
                        placeholder="Select..."
                        showClear
                        className="w-full p-inputtext-sm"
                    />
                </div>
                <div className="w-30rem">
                    <label className="block mb-2 text-sm font-semibold">Categories</label>
                    <MultiSelect
                        value={form.categories}
                        onChange={(e) => onCategoriesChange(e.value)}
                        options={categoryOptions}
                        optionLabel="description"
                        optionValue="value"
                        dataKey="id"
                        itemTemplate={optionTemplate}
                        placeholder="Select categories"
                        display="chip"
                        maxSelectedLabels={3}
                        selectedItemsLabel="..."
                        showSelectAll={false}
                        className="w-full p-inputtext-sm"
                    />
                </div>
            </div>

            {form.categories.length > 0 && (
                <div className="flex flex-column gap-3 mb-6">
                    <div className="flex flex-wrap align-items-end gap-2">
                        <div className="w-12rem">
                            <label className="text-sm font-semibold">Category</label>
                        </div>
                        <div className="w-16rem">
                            <label className="text-sm font-semibold">Inventory</label>
                        </div>
                    </div>
                    {form.categories.map((category) => {
                        const categoryId = getValueId(category);
                        const categoryLabel = getOptionLabel(
                            categoryOptions,
                            category,
                            'description',
                        );

                        return (
                            <div
                                key={categoryId}
                                className="flex flex-wrap align-items-end gap-2"
                            >
                                <div className="w-12rem">
                                    <div className="text-sm line-height-3 py-2">
                                        {categoryLabel}
                                    </div>
                                </div>
                                <div className="w-16rem">
                                    <Dropdown
                                        value={form.inventorySelections[categoryId] ?? null}
                                        onChange={(e) => onInventoryChange(category, e.value)}
                                        options={inventoryOptions}
                                        optionLabel="description"
                                        optionValue="value"
                                        dataKey="id"
                                        itemTemplate={optionTemplate}
                                        valueTemplate={(value) =>
                                            selectedInventoryTemplate(inventoryOptions, value)
                                        }
                                        placeholder="Select inventory"
                                        showClear
                                        className="w-full p-inputtext-sm"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    rounded
                                    text
                                    severity="danger"
                                    aria-label={`Remove ${categoryLabel}`}
                                    onClick={() => onCategoryRemove(category)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

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
    );
}
