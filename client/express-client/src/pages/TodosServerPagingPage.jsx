import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { getTodosPaged } from '../services/todos-service.js';

export default function TodosServerPagingPage() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState(1);

    const page = Math.floor(first / rows) + 1;
    const order = sortOrder === -1 ? 'desc' : 'asc';

    const { data, isFetching, error } = useQuery({
        queryKey: ['todos', { page, rows, sortField, order }],
        queryFn: () => getTodosPaged(page, rows, sortField, order),
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

    return (
        <section>
            <h1 className="text-2xl mb-3">Todos (Server Paging)</h1>
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
                rowsPerPageOptions={[10, 25, 50]}
                responsiveLayout="scroll"
                emptyMessage="No todos found."
            >
                <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
                <Column field="title" header="Title" sortable />
                <Column field="status" header="Status" sortable />
                <Column field="priority" header="Priority" sortable />
                <Column field="dueDate" header="Due Date" sortable />
                <Column field="tags" header="Tags" sortable />
            </DataTable>
        </section>
    );
}
