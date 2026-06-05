import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';

import { router } from './router.jsx';
import { getStoredTheme, setTheme } from './lib/themes.js';

setTheme(getStoredTheme());

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => error?.code !== 'NETWORK_ERROR' && failureCount < 3,
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider>
                <RouterProvider router={router} />
            </PrimeReactProvider>
        </QueryClientProvider>
    </StrictMode>,
);

const showApp = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.remove('app-loading');
        });
    });
};

if (document.readyState === 'complete') {
    showApp();
} else {
    window.addEventListener('load', showApp, { once: true });
}
