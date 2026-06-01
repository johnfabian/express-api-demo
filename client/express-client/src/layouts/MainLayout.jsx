import { useMemo, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Link, Outlet } from 'react-router';
import { THEMES, getStoredTheme, setTheme, findCounterpart } from '../lib/themes.js';

const navItems = [
    {
        label: 'UI Patterns',
        icon: 'pi pi-th-large',
        template: (item, options) => (
            <Link to="/ui-patterns" className={options.className}>
                <span className={item.icon} />
                <span className="ml-2">{item.label}</span>
            </Link>
        ),
    },
    {
        label: 'UI Patterns 2',
        icon: 'pi pi-table',
        template: (item, options) => (
            <Link to="/ui-patterns-2" className={options.className}>
                <span className={item.icon} />
                <span className="ml-2">{item.label}</span>
            </Link>
        ),
    },
    {
        label: 'Todos-Client',
        icon: 'pi pi-check-square',
        template: (item, options) => (
            <Link to="/todos-client" className={options.className}>
                <span className={item.icon} />
                <span className="ml-2">{item.label}</span>
            </Link>
        ),
    },
    {
        label: 'Todos-Server',
        icon: 'pi pi-server',
        template: (item, options) => (
            <Link to="/todos-server" className={options.className}>
                <span className={item.icon} />
                <span className="ml-2">{item.label}</span>
            </Link>
        ),
    },
];

const start = <span className="text-xl font-bold mx-3">Express Client</span>;

const Swatch = ({ hex }) => (
    <span
        className="inline-block border-circle border-1 surface-border"
        style={{ width: '0.85rem', height: '0.85rem', background: hex }}
    />
);

export default function MainLayout() {
    const [themeName, setThemeName] = useState(getStoredTheme());

    const current = THEMES.find((t) => t.name === themeName);
    const mode = current?.mode ?? 'light';

    const options = useMemo(() => THEMES.filter((t) => t.mode === mode), [mode]);

    const applyTheme = (name) => {
        if (!name) return;
        setThemeName(name);
        setTheme(name);
    };

    const onThemeChange = (e) => applyTheme(e.value?.name);

    const toggleMode = () => {
        const next = findCounterpart(themeName, mode === 'light' ? 'dark' : 'light');
        applyTheme(next);
    };

    const itemTemplate = (opt) => (
        <div className="flex align-items-center gap-2">
            <Swatch hex={opt.color.hex} />
            <span>{opt.label}</span>
        </div>
    );

    const valueTemplate = (opt) =>
        opt ? (
            <div className="flex align-items-center gap-2">
                <Swatch hex={opt.color.hex} />
                <span>{opt.label}</span>
            </div>
        ) : (
            <span>Theme</span>
        );

    const end = (
        <div className="flex align-items-center gap-2 mx-3">
            <Button
                icon={mode === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
                rounded
                text
                size="small"
                aria-label="Toggle dark mode"
                onClick={toggleMode}
            />
            <Dropdown
                value={current}
                onChange={onThemeChange}
                options={options}
                optionLabel="label"
                dataKey="name"
                itemTemplate={itemTemplate}
                valueTemplate={valueTemplate}
                placeholder="Theme"
                className="p-inputtext-sm w-12rem"
            />
        </div>
    );

    return (
        <div className="flex flex-column min-h-screen">
            <Menubar model={navItems} start={start} end={end} />
            <main className="p-4 flex-grow-1">
                <Outlet />
            </main>
        </div>
    );
}
