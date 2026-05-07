import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { getTodosPaged } from '../services/todos-service.js';
import {
    INITIAL_FILTERS,
    PRIORITY_OPTIONS,
    STATUS_OPTIONS,
    dropdownFilterElement,
    toApiFilters,
} from '../lib/todos-filters.jsx';

export default function TodosServerPagingPage() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState(1);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const page = Math.floor(first / rows) + 1;
    const order = sortOrder === -1 ? 'desc' : 'asc';
    const apiFilters = toApiFilters(filters);

    const { data, isFetching, error } = useQuery({
        queryKey: ['todos', 'server-paging', { page, rows, sortField, order, filters: apiFilters, q: searchQuery }],
        queryFn: () => getTodosPaged(page, rows, sortField, order, { filters: apiFilters, q: searchQuery }),
        placeholderData: keepPreviousData,
    });

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const onSort = (event) => {
        setFirst(0);
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    };

    const onFilter = (event) => {
        setFirst(0);
        setFilters(event.filters);
    };

    const onSearchChange = (event) => {
        setFirst(0);
        setSearchInput(event.target.value);
    };

    return (
        <section>
            <div className="flex justify-content-between align-items-center mb-3">
                <h1 className="text-2xl m-0">Todos (Server Paging)</h1>
                <InputText
                    value={searchInput}
                    onChange={onSearchChange}
                    placeholder="Search title, status, priority, tags..."
                    style={{ width: '20rem' }}
                />
            </div>
            {error && <Message severity="error" text={error.message} className="mb-3 w-full" />}
            <DataTable
                value={data?.items ?? []}
                loading={isFetching}
                stripedRows
                lazy
                paginator
                first={first}
                rows={rows}
                totalRecords={data?.total ?? 0}
                onPage={onPage}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                filters={filters}
                onFilter={onFilter}
                filterDisplay="row"
                filterDelay={300}
                removableSort
                rowsPerPageOptions={[10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                responsiveLayout="scroll"
                emptyMessage="No todos found."
            >
                <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
                <Column field="title" header="Title" sortable filter filterPlaceholder="Search title" />
                <Column
                    field="status"
                    header="Status"
                    sortable
                    filter
                    showFilterMenu={false}
                    filterElement={(options) => dropdownFilterElement(options, STATUS_OPTIONS, 'Any')}
                />
                <Column
                    field="priority"
                    header="Priority"
                    sortable
                    filter
                    showFilterMenu={false}
                    filterElement={(options) => dropdownFilterElement(options, PRIORITY_OPTIONS, 'Any')}
                />
                <Column field="dueDate" header="Due Date" sortable />
                <Column field="tags" header="Tags" sortable filter filterPlaceholder="Search tags" />
            </DataTable>
        </section>
    );
}
