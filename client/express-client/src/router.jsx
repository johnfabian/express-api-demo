import { createBrowserRouter, Navigate } from 'react-router';
import MainLayout from './layouts/MainLayout.jsx';
import TodosClientPagingPage from './pages/TodosClientPagingPage.jsx';
import TodosServerPagingPage from './pages/TodosServerPagingPage.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { index: true, element: <Navigate to="/todos-client" replace /> },
            { path: 'todos-client', Component: TodosClientPagingPage },
            { path: 'todos-server', Component: TodosServerPagingPage },
        ],
    },
]);
