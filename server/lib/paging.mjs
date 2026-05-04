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

export async function paginate(sql, { table, select, page, pageSize, sortColumn = 'id', sortOrder = 'asc' }) {
    const offset = (page - 1) * pageSize;
    const direction = sortOrder === 'desc' ? sql`DESC` : sql`ASC`;
    const sortExpr = sortColumn === 'id'
        ? sql`id`
        : sql`natural_sort_key(${sql(sortColumn)})`;
    const orderBy = sql`ORDER BY ${sortExpr} ${direction}, id ASC`;
    const cols = select ?? sql`*`;

    const [items, count] = await Promise.all([
        sql`SELECT ${cols} FROM ${sql(table)} ${orderBy} LIMIT ${pageSize} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS total FROM ${sql(table)}`,
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
