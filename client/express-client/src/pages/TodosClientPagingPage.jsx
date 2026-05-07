import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { getTodos } from '../services/todos-service.js';
import {
    INITIAL_FILTERS,
    PRIORITY_OPTIONS,
    STATUS_OPTIONS,
    dropdownFilterElement,
} from '../lib/todos-filters.jsx';

export default function TodosPage() {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const { data: todos = [], isFetching, error } = useQuery({
        queryKey: ['todos', 'client-paging', { q: searchQuery }],
        queryFn: () => getTodos({ q: searchQuery }),
    });

    return (
        <section>
            <div className="flex justify-content-between align-items-center mb-3">
                <h1 className="text-2xl m-0">Todos</h1>
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search title, status, priority, tags..."
                    style={{ width: '20rem' }}
                />
            </div>
            {error && <Message severity="error" text={error.message} className="mb-3 w-full" />}
            <DataTable
                value={todos}
                loading={isFetching}
                stripedRows
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="row"
                filterDelay={300}
                removableSort
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
                <Column
                    field="tags"
                    header="Tags"
                    filter
                    filterPlaceholder="Search tags"
                />
            </DataTable>
        </section>
    );
}
