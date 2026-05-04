import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { getTodosPaged } from '../services/todos-service.js';

export default function TodosServerPagingPage() {
    const [todos, setTodos] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const page = Math.floor(first / rows) + 1;
        const order = sortOrder === -1 ? 'desc' : 'asc';

        async function load() {
            try {
                const result = await getTodosPaged(page, rows, sortField, order);
                if (cancelled) return;
                setTodos(result.items);
                setTotalRecords(result.total);
                setError(null);
            } catch (err) {
                if (cancelled) return;
                setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [first, rows, sortField, sortOrder]);

    const onPage = (event) => {
        setLoading(true);
        setFirst(event.first);
        setRows(event.rows);
    };

    const onSort = (event) => {
        setLoading(true);
        setFirst(0);
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    };

    return (
        <section>
            <h1 className="text-2xl mb-3">Todos (Server Paging)</h1>
            {error && <Message severity="error" text={error} className="mb-3 w-full" />}
            <DataTable
                value={todos}
                loading={loading}
                stripedRows
                lazy
                paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
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
