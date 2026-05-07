export function parsePagingQuery(query, allowedSortFields) {
    const hasPageSize = query.pageSize !== undefined;
    const hasPage = query.page !== undefined;

    if (!hasPageSize && !hasPage) {
        return { skipped: true };
    }

    if (!hasPageSize) {
        return { errors: ["Query param 'pageSize' is required when 'page' is provided."] };
    }

    const pageSize = Number.parseInt(query.pageSize, 10);
    const page = hasPage ? Number.parseInt(query.page, 10) : 1;

    if (!Number.isInteger(pageSize) || pageSize < 1) {
        return { errors: ["Query param 'pageSize' must be a positive integer."] };
    }
    if (!Number.isInteger(page) || page < 1) {
        return { errors: ["Query param 'page' must be a positive integer."] };
    }

    const { sortField, sortOrder } = query;

    if (sortField !== undefined && !Object.hasOwn(allowedSortFields, sortField)) {
        return {
            errors: [`Query param 'sortField' must be one of: ${Object.keys(allowedSortFields).join(', ')}.`],
        };
    }
    if (sortOrder !== undefined && sortOrder !== 'asc' && sortOrder !== 'desc') {
        return { errors: ["Query param 'sortOrder' must be 'asc' or 'desc'."] };
    }

    return {
        paging: {
            page,
            pageSize,
            sortColumn: sortField ? allowedSortFields[sortField] : 'id',
            sortOrder: sortOrder ?? 'asc',
        },
    };
}

export const ALLOWED_MATCH_MODES = new Set([
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'equals',
    'notEquals',
]);

export function parseFilterQuery(query, allowedFilterFields, qColumns = []) {
    const filters = [];
    const errors = [];

    for (const [key, config] of Object.entries(allowedFilterFields)) {
        const raw = query[key];
        if (raw === undefined || raw === '') continue;
        if (typeof raw !== 'string') {
            errors.push(`Query param '${key}' must be a string.`);
            continue;
        }
        const modeKey = `${key}MatchMode`;
        const rawMode = query[modeKey];
        let matchMode = config.defaultMode ?? 'contains';
        if (rawMode !== undefined) {
            if (!ALLOWED_MATCH_MODES.has(rawMode)) {
                errors.push(`Query param '${modeKey}' must be one of: ${[...ALLOWED_MATCH_MODES].join(', ')}.`);
                continue;
            }
            matchMode = rawMode;
        }
        filters.push({ column: config.column, matchMode, value: raw });
    }

    let q;
    if (query.q !== undefined && query.q !== '') {
        if (typeof query.q !== 'string') {
            errors.push("Query param 'q' must be a string.");
        } else {
            q = query.q;
        }
    }

    if (errors.length) return { errors };
    return { filters, q, qColumns };
}

function matchModeClause(sql, column, matchMode, value) {
    const col = sql(column);
    switch (matchMode) {
        case 'contains':
            return sql`${col} ILIKE ${'%' + value + '%'}`;
        case 'notContains':
            return sql`${col} NOT ILIKE ${'%' + value + '%'}`;
        case 'startsWith':
            return sql`${col} ILIKE ${value + '%'}`;
        case 'endsWith':
            return sql`${col} ILIKE ${'%' + value}`;
        case 'equals':
            return sql`${col} ILIKE ${value}`;
        case 'notEquals':
            return sql`${col} NOT ILIKE ${value}`;
        default:
            return sql`${col} ILIKE ${'%' + value + '%'}`;
    }
}

export function buildWhere(sql, filters = [], q, qColumns = []) {
    const conditions = [];

    for (const { column, matchMode, value } of filters) {
        conditions.push(matchModeClause(sql, column, matchMode, value));
    }

    if (q && qColumns.length) {
        const pattern = `%${q}%`;
        const orParts = qColumns.map((col) => sql`${sql(col)} ILIKE ${pattern}`);
        const combined = orParts.reduce((acc, c, i) => (i === 0 ? c : sql`${acc} OR ${c}`));
        conditions.push(sql`(${combined})`);
    }

    if (conditions.length === 0) return sql``;

    const where = conditions.reduce((acc, c, i) => (i === 0 ? c : sql`${acc} AND ${c}`));
    return sql`WHERE ${where}`;
}

export async function paginate(sql, { table, select, page, pageSize, sortColumn = 'id', sortOrder = 'asc', filters, q, qColumns }) {
    const offset = (page - 1) * pageSize;
    const direction = sortOrder === 'desc' ? sql`DESC` : sql`ASC`;
    const sortExpr = sortColumn === 'id'
        ? sql`id`
        : sql`natural_sort_key(${sql(sortColumn)})`;
    const orderBy = sql`ORDER BY ${sortExpr} ${direction}, id ASC`;
    const cols = select ?? sql`*`;
    const where = buildWhere(sql, filters, q, qColumns);

    const [items, count] = await Promise.all([
        sql`SELECT ${cols} FROM ${sql(table)} ${where} ${orderBy} LIMIT ${pageSize} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS total FROM ${sql(table)} ${where}`,
    ]);

    const total = count[0].total;
    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
