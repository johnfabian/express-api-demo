import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BlockUI } from 'primereact/blockui';
import { STATUS_OPTIONS, inventoryLabelFor, labelFor, statusLabelFor } from './options.js';

export default function UIPatternsDataTable({
    rows,
    filters,
    editingId,
    isEditing,
    onEdit,
    onDelete,
    onFilter,
}) {
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
    const statusBody = (row) => statusLabelFor(row.status);
    const categoriesBody = (row) =>
        row.categories.map((c) => <div key={c.category}>{labelFor(c.category)}</div>);
    const inventoryBody = (row) =>
        row.categories
            .filter((c) => c.inventory)
            .map((c) => <div key={c.category}>{inventoryLabelFor(c.inventory)}</div>);

    const rowClassName = (row) => (row.id === editingId ? 'ui-patterns-selected-row' : '');

    const statusFilterElement = (options) => (
        <Dropdown
            value={options.value}
            options={STATUS_OPTIONS}
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
                value={rows}
                stripedRows
                emptyMessage="No rows yet."
                rowClassName={rowClassName}
                filters={filters}
                onFilter={onFilter}
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
