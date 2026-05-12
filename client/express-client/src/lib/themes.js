const themeFiles = import.meta.glob(
    '../../../../node_modules/primereact/resources/themes/*/theme.css',
    { query: '?url', import: 'default', eager: true },
);

const COLOR_KEYS = [
    'deeppurple',
    'blue',
    'green',
    'orange',
    'purple',
    'cyan',
    'indigo',
    'pink',
    'teal',
    'amber',
];

const COLOR_HEX = {
    deeppurple: '#673ab7',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f97316',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    indigo: '#6366f1',
    pink: '#ec4899',
    teal: '#14b8a6',
    amber: '#f59e0b',
};

const DARK_FAMILIES = /^(arya|luna|vela)/;

function parseMode(name) {
    if (name.includes('light')) return 'light';
    if (name.includes('dark')) return 'dark';
    if (DARK_FAMILIES.test(name)) return 'dark';
    return 'light';
}

function parseColor(name) {
    for (const key of COLOR_KEYS) {
        if (name.includes(key)) return { name: key, hex: COLOR_HEX[key] };
    }
    return { name: '', hex: '#6b7280' };
}

function parseFamily(name) {
    return name
        .split('-')
        .filter((p) => p !== 'light' && p !== 'dark' && !COLOR_KEYS.includes(p))
        .join('-');
}

function parseLabel(name) {
    return name
        .split('-')
        .filter((p) => p !== 'light' && p !== 'dark')
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join(' ');
}

export const THEMES = Object.entries(themeFiles)
    .map(([path, url]) => {
        const name = path.match(/themes\/([^/]+)\//)[1];
        return {
            name,
            url,
            mode: parseMode(name),
            color: parseColor(name),
            family: parseFamily(name),
            label: parseLabel(name),
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

export const DEFAULT_THEME = 'tailwind-light';
const THEME_LINK_ID = 'prime-theme';
const STORAGE_KEY = 'prime-theme';

export function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
}

export function setTheme(name) {
    const theme = THEMES.find((t) => t.name === name);
    if (!theme) return;
    let link = document.getElementById(THEME_LINK_ID);
    if (!link) {
        link = document.createElement('link');
        link.id = THEME_LINK_ID;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    link.href = theme.url;
    localStorage.setItem(STORAGE_KEY, name);
}

export function findCounterpart(currentName, newMode) {
    const current = THEMES.find((t) => t.name === currentName);
    if (!current) return THEMES.find((t) => t.mode === newMode)?.name;
    return (
        THEMES.find(
            (t) => t.mode === newMode && t.family === current.family && t.color.name === current.color.name,
        )?.name
        ?? THEMES.find((t) => t.mode === newMode && t.family === current.family)?.name
        ?? THEMES.find((t) => t.mode === newMode)?.name
    );
}
