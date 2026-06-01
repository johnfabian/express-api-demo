import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { INVENTORY_OPTIONS, STATUS_OPTIONS } from './options.js';

export default function UIPatternsForm({
    form,
    isEditing,
    canSave,
    canAddCategoryRow,
    getCategoryOptions,
    onAddCategoryRow,
    onCategoryRowChange,
    onRemoveCategoryRow,
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
                                onClick={onAddCategoryRow}
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
                                onClick={() => onRemoveCategoryRow(categoryRow.id)}
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
                        onClick={onReset}
                    />
                )}
            </div>
        </form>
    );
}
