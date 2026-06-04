import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import {
    CATEGORY_OPTIONS,
    INVENTORY_OPTIONS,
    STATUS_OPTIONS,
    getCategoryLabel,
    getInventoryLabel,
} from './options.js';
import { picklistHelper } from './picklistHelper.js';

const optionTemplate = (option) => (
    <span>{picklistHelper.getSelectedLabel([], option, 'description')}</span>
);

const selectedInventoryTemplate = (value) => {
    if (!value) return <span>Select inventory</span>;
    return <span>{getInventoryLabel(value)}</span>;
};

export default function UIPatternsForm3({
    form,
    isEditing,
    canSave,
    onCategoriesChange,
    onCategoryRemove,
    onInventoryChange,
    onSave,
    onSetField,
    onReset,
}) {
    return (
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
                        onChange={(e) => onSetField('name', e.target.value)}
                        placeholder="Enter a name"
                        className="w-full p-inputtext-sm"
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Date</label>
                    <Calendar
                        value={form.date}
                        onChange={(e) => onSetField('date', e.value)}
                        placeholder="Select a date"
                        className="w-full"
                        inputClassName="p-inputtext-sm w-full"
                    />
                </div>
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Status</label>
                    <Dropdown
                        value={form.status}
                        onChange={(e) => onSetField('status', e.value)}
                        options={STATUS_OPTIONS}
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
                        onChange={(e) => onCategoriesChange(e.value ?? [])}
                        options={CATEGORY_OPTIONS}
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
                    {form.categories.map((category) => {
                        const categoryId = picklistHelper.getSelectedId(
                            category,
                            'description',
                        );

                        return (
                            <div key={categoryId} className="flex flex-wrap align-items-end gap-2">
                                <div className="w-12rem">
                                    <label className="block mb-2 text-sm font-semibold">
                                        Category
                                    </label>
                                    <div className="text-sm line-height-3 py-2">
                                        {getCategoryLabel(category)}
                                    </div>
                                </div>
                                <div className="w-16rem">
                                    <label className="block mb-2 text-sm font-semibold">
                                        Inventory <span className="font-normal">(optional)</span>
                                    </label>
                                    <Dropdown
                                        value={form.inventorySelections[categoryId] ?? null}
                                        onChange={(e) => onInventoryChange(categoryId, e.value)}
                                        options={INVENTORY_OPTIONS}
                                        optionLabel="description"
                                        optionValue="value"
                                        dataKey="id"
                                        itemTemplate={optionTemplate}
                                        valueTemplate={selectedInventoryTemplate}
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
                                    aria-label={`Remove ${getCategoryLabel(category)}`}
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
                        onClick={onReset}
                    />
                )}
            </div>
        </form>
    );
}
