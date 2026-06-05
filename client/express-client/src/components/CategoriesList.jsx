import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import {
    getOptionLabel,
    getValueId,
} from '../lib/picklist-helper.js';

const optionTemplate = (option) => (
    <span>{option.description}</span>
);

const selectedInventoryTemplate = (inventoryOptions, value) => {
    if (!value) return <span>Select inventory</span>;
    return <span>{getOptionLabel(inventoryOptions, value, 'description')}</span>;
};

export default function CategoriesList({
    categories,
    categoryOptions,
    control,
    inventoryOptions,
    inventorySelections,
    onCategoryRemove,
}) {
    if (categories.length === 0) return null;

    return (
        <div className="flex flex-column gap-3 mb-6">
            <div className="flex flex-wrap align-items-end gap-2">
                <div className="w-12rem">
                    <label className="text-sm font-semibold">Category</label>
                </div>
                <div className="w-16rem">
                    <label className="text-sm font-semibold">Inventory</label>
                </div>
            </div>
            {categories.map((category) => {
                const categoryId = getValueId(category);
                const categoryLabel = getOptionLabel(
                    categoryOptions,
                    category,
                    'description',
                );

                return (
                    <div key={categoryId} className="flex flex-wrap align-items-end gap-2">
                        <div className="w-12rem">
                            <div className="text-sm line-height-3 py-2">{categoryLabel}</div>
                        </div>
                        <div className="w-16rem">
                            <Controller
                                name={`inventorySelections.${categoryId}`}
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        value={inventorySelections[categoryId] ?? null}
                                        onChange={(e) => field.onChange(e.value ?? null)}
                                        onBlur={field.onBlur}
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
                                )}
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
    );
}
