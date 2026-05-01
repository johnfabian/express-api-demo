import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { getTodos } from '../services/todos-service.js';

export default function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTodos()
            .then(setTodos)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section>
            <h1 className="text-2xl mb-3">Todos</h1>
            {error && <Message severity="error" text={error} className="mb-3 w-full" />}
            <DataTable
                value={todos}
                loading={loading}
                stripedRows
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                responsiveLayout="scroll"
                emptyMessage="No todos found."
            >
                <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
                <Column field="title" header="Title" sortable />
                <Column field="status" header="Status" sortable />
                <Column field="priority" header="Priority" sortable />
                <Column field="dueDate" header="Due Date" sortable />
                <Column field="tags" header="Tags" />
            </DataTable>
        </section>
    );
}
