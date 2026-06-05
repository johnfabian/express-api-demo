import { useMemo, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BlockUI } from 'primereact/blockui';
import {
    getOptionLabel,
    getValueId,
} from '../../lib/picklist-helper.js';

const INITIAL_FILTERS = {
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    categoriesText: { value: null, matchMode: FilterMatchMode.CONTAINS },
    inventoryText: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export default function UIPatternsDataTable2({
    dataTableRows,
    editingId,
    isEditing,
    onEdit,
    onDelete,
    refAllCategoryOptions,
    refAllInventoryOptions,
    refAllStatusOptions,
}) {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const categoryOptions = refAllCategoryOptions.current;
    const inventoryOptions = refAllInventoryOptions.current;
    const statusOptions = refAllStatusOptions.current;
    const tableRows = useMemo(
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

    const actionsBody = (row) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                rounded
                text
                size="small"
                aria-label="Edit"
                onClick={() => onEdit(row)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                size="small"
                severity="danger"
                aria-label="Delete"
                onClick={(e) => onDelete(e, row)}
            />
        </div>
    );

    const dateBody = (row) => (row.date ? new Date(row.date).toLocaleDateString() : '');
    const statusBody = (row) => getOptionLabel(statusOptions, row.status);
    const categoriesBody = (row) =>
        row.categories
            .map((category) =>
                getOptionLabel(categoryOptions, category.category, 'description'),
            )
            .join(', ');
    const inventoryBody = (row) =>
        row.categories
            .filter((category) => category.inventory)
            .map((category) => (
                <div key={getValueId(category.category)}>
                    {getOptionLabel(inventoryOptions, category.inventory, 'description')}
                </div>
            ));

    const rowClassName = (row) => (row.id === editingId ? 'ui-patterns-selected-row' : '');

    const statusFilterElement = (options) => (
        <Dropdown
            value={options.value}
            options={statusOptions}
            optionLabel="label"
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Any"
            showClear
            className="p-column-filter p-inputtext-sm"
        />
    );

    const dateFilterElement = (options) => (
        <Calendar
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Date"
            dateFormat="mm/dd/yy"
            className="p-column-filter"
            inputClassName="p-inputtext-sm w-full"
        />
    );

    return (
        <BlockUI blocked={isEditing} className="mb-5">
            <DataTable
                className="ui-patterns-table"
                value={tableRows}
                stripedRows
                emptyMessage="No rows yet."
                rowClassName={rowClassName}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="row"
                filterDelay={300}
                removableSort
            >
                <Column header="" body={actionsBody} style={{ width: '7rem' }} />
                <Column
                    field="name"
                    header="Name"
                    sortable
                    filter
                    filterPlaceholder="Search"
                    showFilterMenu={false}
                />
                <Column
                    field="date"
                    header="Date"
                    body={dateBody}
                    sortable
                    filter
                    filterElement={dateFilterElement}
                    showFilterMenu={false}
                />
                <Column
                    field="status"
                    header="Status"
                    body={statusBody}
                    sortable
                    filter
                    filterElement={statusFilterElement}
                    showFilterMenu={false}
                />
                <Column
                    field="categoriesText"
                    header="Categories"
                    body={categoriesBody}
                    sortable
                    filter
                    filterPlaceholder="Search"
                    showFilterMenu={false}
                />
                <Column
                    field="inventoryText"
                    header="Inventory"
                    body={inventoryBody}
                    sortable
                    filter
                    filterPlaceholder="Search"
                    showFilterMenu={false}
                />
            </DataTable>
        </BlockUI>
    );
}
