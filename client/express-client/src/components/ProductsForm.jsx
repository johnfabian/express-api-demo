import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import {
    getValueId,
} from '../lib/picklist-helper.js';
import CategoriesList from './CategoriesList.jsx';

const optionTemplate = (option) => (
    <span>{option.description}</span>
);

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

export default function ProductsForm({
    categoryOptions,
    inventoryOptions,
    statusOptions,
    initialValues,
    isEditing,
    onSave,
    onReset,
}) {
    const {
        control,
        getValues,
        handleSubmit,
        reset,
        setValue,
    } = useForm({
        defaultValues: initialValues,
        mode: 'onChange',
    });

    const name = useWatch({ control, name: 'name' }) ?? '';
    const categories = useWatch({ control, name: 'categories' }) ?? [];
    const inventorySelections = useWatch({ control, name: 'inventorySelections' }) ?? {};
    const canSave = name.trim() !== '' && categories.length > 0;

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const onCategoriesChange = (nextCategories, onChange) => {
        const categoryValues = nextCategories ?? [];
        const selectedCategoryIds = categoryValues.map((category) => String(getValueId(category)));
        const currentInventorySelections = getValues('inventorySelections') ?? {};
        const nextInventorySelections = pruneInventorySelections(
            currentInventorySelections,
            selectedCategoryIds,
        );

        onChange(categoryValues);
        setValue('inventorySelections', nextInventorySelections, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const onCategoryRemove = (categoryToRemove) => {
        const removedId = getValueId(categoryToRemove);
        const nextCategories = categories.filter(
            (category) => getValueId(category) !== removedId,
        );
        const nextInventorySelections = { ...getValues('inventorySelections') };
        delete nextInventorySelections[removedId];

        setValue('categories', nextCategories, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue('inventorySelections', nextInventorySelections, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const onSubmit = (values) => {
        if (!canSave) return;

        onSave(values);
        reset(createEmptyForm());
    };

    const onCancel = () => {
        reset(createEmptyForm());
        onReset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Name</label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ validate: (value) => (value ?? '').trim() !== '' }}
                        render={({ field }) => (
                            <InputText
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                placeholder="Enter a name"
                                className="w-full p-inputtext-sm"
                            />
                        )}
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Date</label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                onBlur={field.onBlur}
                                placeholder="Select a date"
                                className="w-full"
                                inputClassName="p-inputtext-sm w-full"
                            />
                        )}
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                onBlur={field.onBlur}
                                options={statusOptions}
                                optionLabel="label"
                                placeholder="Select..."
                                showClear
                                className="w-full p-inputtext-sm"
                            />
                        )}
                    />
                </div>
                <div className="w-30rem">
                    <label className="block mb-2 text-sm font-semibold">Categories</label>
                    <Controller
                        name="categories"
                        control={control}
                        rules={{ validate: (value) => (value ?? []).length > 0 }}
                        render={({ field }) => (
                            <MultiSelect
                                value={field.value}
                                onChange={(e) => onCategoriesChange(e.value, field.onChange)}
                                onBlur={field.onBlur}
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
                        )}
                    />
                </div>
            </div>

            <CategoriesList
                categories={categories}
                categoryOptions={categoryOptions}
                control={control}
                inventoryOptions={inventoryOptions}
                inventorySelections={inventorySelections}
                onCategoryRemove={onCategoryRemove}
            />

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
                        onClick={onCancel}
                    />
                )}
            </div>
        </form>
    );
}
