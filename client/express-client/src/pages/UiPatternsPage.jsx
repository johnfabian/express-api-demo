import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

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

export default function UiPatternsPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [subSelections, setSubSelections] = useState({});
    const [payload, setPayload] = useState(null);

    const onCategoriesChange = (e) => {
        const next = e.value;
        setSelectedCategories(next);
        setSubSelections((prev) => {
            const cleaned = {};
            for (const cat of next) {
                if (prev[cat] !== undefined) cleaned[cat] = prev[cat];
            }
            return cleaned;
        });
    };

    const onSubChange = (category, value) => {
        setSubSelections((prev) => ({ ...prev, [category]: value }));
    };

    const onSave = () => {
        const data = {
            categories: selectedCategories.map((cat) => ({
                category: cat,
                subcategory: subSelections[cat] ?? null,
            })),
        };
        setPayload(data);
    };

    const labelFor = (cat) => CATEGORY_OPTIONS.find((c) => c.value === cat)?.label ?? cat;

    return (
        <section>
            <h1 className="text-2xl font-bold mb-3">UI Patterns</h1>

            <div className="mb-6 w-20rem">
                <label className="block mb-2 text-sm font-semibold">Product Categories</label>
                <MultiSelect
                    value={selectedCategories}
                    onChange={onCategoriesChange}
                    options={CATEGORY_OPTIONS}
                    optionLabel="label"
                    placeholder="Select categories"
                    display="comma"
                    className="w-full p-inputtext-sm"
                />
            </div>

            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                    {selectedCategories.map((cat) => (
                        <div key={cat} className="w-12rem">
                            <label className="block mb-2 text-sm font-semibold">
                                {labelFor(cat)} <span className="font-normal">(optional)</span>
                            </label>
                            <Dropdown
                                value={subSelections[cat] ?? null}
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

            <Button
                label="Save"
                icon="pi pi-save"
                onClick={onSave}
                disabled={selectedCategories.length === 0}
            />

            {payload && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Payload to send</h3>
                    <pre className="p-3 surface-100 border-round overflow-x-auto">
                        {JSON.stringify(payload, null, 2)}
                    </pre>
                </div>
            )}
        </section>
    );
}
