import { Menubar } from 'primereact/menubar';
import { Link, Outlet } from 'react-router';

const navItems = [
    {
        label: 'Todos',
        icon: 'pi pi-check-square',
        template: (item, options) => (
            <Link to="/todos" className={options.className}>
                <span className={item.icon} />
                <span className="ml-2">{item.label}</span>
            </Link>
        ),
    },
];

const start = <span className="text-xl font-bold mx-3">Express Client</span>;

export default function MainLayout() {
    return (
        <div className="flex flex-column min-h-screen">
            <Menubar model={navItems} start={start} />
            <main className="p-4 flex-grow-1">
                <Outlet />
            </main>
        </div>
    );
}
