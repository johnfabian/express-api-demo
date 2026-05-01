import { createBrowserRouter, Navigate } from 'react-router';
import MainLayout from './layouts/MainLayout.jsx';
import TodosPage from './pages/TodosPage.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { index: true, element: <Navigate to="/todos" replace /> },
            { path: 'todos', Component: TodosPage },
        ],
    },
]);
