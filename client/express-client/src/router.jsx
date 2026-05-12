import { createBrowserRouter, Navigate } from 'react-router';
import MainLayout from './layouts/MainLayout.jsx';
import TodosClientPagingPage from './pages/TodosClientPagingPage.jsx';
import TodosServerPagingPage from './pages/TodosServerPagingPage.jsx';
import UiPatternsPage from './pages/UiPatternsPage.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { index: true, element: <Navigate to="/ui-patterns" replace /> },
            { path: 'ui-patterns', Component: UiPatternsPage },
            { path: 'todos-client', Component: TodosClientPagingPage },
            { path: 'todos-server', Component: TodosServerPagingPage },
        ],
    },
]);
