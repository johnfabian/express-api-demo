import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CATEGORY_OPTIONS = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys' },
];

const SUBCATEGORY_OPTIONS = {
    electronics: [
        { value: 'phones', label: 'Phones' },
        { value: 'laptops', label: 'Laptops' },
        { value: 'tablets', label: 'Tablets' },
        { value: 'headphones', label: 'Headphones' },
    ],
    clothing: [
        { value: 'mens', label: "Men's" },
        { value: 'womens', label: "Women's" },
        { value: 'kids', label: 'Kids' },
        { value: 'accessories', label: 'Accessories' },
    ],
    books: [
        { value: 'fiction', label: 'Fiction' },
        { value: 'non-fiction', label: 'Non-fiction' },
        { value: 'textbooks', label: 'Textbooks' },
        { value: 'comics', label: 'Comics' },
    ],
    sports: [
        { value: 'fitness', label: 'Fitness' },
        { value: 'outdoor', label: 'Outdoor' },
        { value: 'team-sports', label: 'Team Sports' },
        { value: 'water-sports', label: 'Water Sports' },
    ],
    toys: [
        { value: 'educational', label: 'Educational' },
        { value: 'puzzles', label: 'Puzzles' },
        { value: 'action-figures', label: 'Action Figures' },
        { value: 'board-games', label: 'Board Games' },
    ],
};

const STATUS_OPTIONS = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
];

const EMPTY_FORM = {
    name: '',
    date: null,
    status: null,
    categories: [],
    subSelections: {},
};

export default function UiPatternsPage() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [rows, setRows] = useState([]);

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const onCategoriesChange = (e) => {
        const next = e.value;
        setForm((prev) => {
            const cleaned = {};
            for (const cat of next) {
                if (prev.subSelections[cat] !== undefined) cleaned[cat] = prev.subSelections[cat];
            }
            return { ...prev, categories: next, subSelections: cleaned };
        });
    };

    const onSubChange = (category, value) => {
        setForm((prev) => ({
            ...prev,
            subSelections: { ...prev.subSelections, [category]: value },
        }));
    };

    const onSave = () => {
        const row = {
            id: rows.length ? rows[rows.length - 1].id + 1 : 1,
            name: form.name,
            date: form.date,
            status: form.status,
            categories: form.categories.map((cat) => ({
                category: cat,
                subcategory: form.subSelections[cat] ?? null,
            })),
        };
        setRows((prev) => [...prev, row]);
        setForm(EMPTY_FORM);
    };

    const labelFor = (cat) => CATEGORY_OPTIONS.find((c) => c.value === cat)?.label ?? cat;
    const subLabelFor = (cat, sub) =>
        SUBCATEGORY_OPTIONS[cat]?.find((s) => s.value === sub)?.label ?? sub;
    const statusLabelFor = (s) => STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;

    const dateBody = (row) => (row.date ? new Date(row.date).toLocaleDateString() : '');
    const statusBody = (row) => statusLabelFor(row.status);
    const categoriesBody = (row) =>
        row.categories.map((c) => labelFor(c.category)).join(', ');

    const subcategoriesBody = (row) =>
        row.categories
            .filter((c) => c.subcategory)
            .map((c) => <div key={c.category}>{subLabelFor(c.category, c.subcategory)}</div>);

    const canSave = form.name.trim() !== '' && form.categories.length > 0;

    return (
        <section>
            <h1 className="text-2xl font-bold mb-3">UI Patterns</h1>

            <DataTable value={rows} stripedRows emptyMessage="No rows yet." className="mb-5">
                <Column field="id" header="ID" style={{ width: '4rem' }} />
                <Column field="name" header="Name" />
                <Column header="Date" body={dateBody} />
                <Column header="Status" body={statusBody} />
                <Column header="Categories" body={categoriesBody} />
                <Column header="Subcategories" body={subcategoriesBody} />
            </DataTable>

            <h2 className="text-lg font-semibold mb-3">Add new</h2>

            <div className="flex flex-wrap gap-3 mb-6">
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
                <div className="w-12rem">
                    <label className="block mb-2 text-sm font-semibold">Product Categories</label>
                    <MultiSelect
                        value={form.categories}
                        onChange={onCategoriesChange}
                        options={CATEGORY_OPTIONS}
                        optionLabel="label"
                        placeholder="Select categories"
                        display="comma"
                        className="w-full p-inputtext-sm"
                    />
                </div>
            </div>

            {form.categories.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                    {form.categories.map((cat) => (
                        <div key={cat} className="w-12rem">
                            <label className="block mb-2 text-sm font-semibold">
                                {labelFor(cat)} <span className="font-normal">(optional)</span>
                            </label>
                            <Dropdown
                                value={form.subSelections[cat] ?? null}
                                onChange={(e) => onSubChange(cat, e.value)}
                                options={SUBCATEGORY_OPTIONS[cat] ?? []}
                                optionLabel="label"
                                placeholder="Select..."
                                showClear
                                className="w-full p-inputtext-sm"
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button label="Save" icon="pi pi-save" onClick={onSave} disabled={!canSave} />
        </section>
    );
}
