/**
 * @openapi
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         status:
 *           type: string
 *         priority:
 *           type: string
 *         dueDate:
 *           type: string
 *         tags:
 *           type: string
 *       example:
 *         id: 1
 *         title: "Task 1"
 *         status: In-Progress
 *         priority: High
 *         dueDate: 2024-02
 *         tags: work
 */

/**
 * @openapi
 * /todos:
 *   get:
 *     tags: [Todos]
 *     summary: Get to-do items (with optional server-side paging)
 *     description: Returns all to-do items when no paging params are supplied. When `pageSize` is provided, returns a single page along with pagination metadata.
 *     parameters:
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: Number of items per page. Omit to return all items.
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (1-indexed). Defaults to 1 when `pageSize` is provided. Requires `pageSize`.
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: sortField
 *         in: query
 *         required: false
 *         description: Field to sort by. Only applies when paging.
 *         schema:
 *           type: string
 *           enum: [id, title, status, priority, dueDate, tags]
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         description: Sort direction. Only applies when paging.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: title
 *         in: query
 *         required: false
 *         description: Filter by title (case-insensitive substring match).
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter by exact status value.
 *         schema:
 *           type: string
 *           enum: [Not-Started, In-Progress, Completed]
 *       - name: priority
 *         in: query
 *         required: false
 *         description: Filter by exact priority value.
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *       - name: tags
 *         in: query
 *         required: false
 *         description: Filter by tags (case-insensitive substring match).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Either a full list of todos (no paging) or a single page with metadata, wrapped in the base response envelope.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - type: array
 *                           items:
 *                             $ref: '#/components/schemas/Todo'
 *                         - type: object
 *                           properties:
 *                             items:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Todo'
 *                             total:
 *                               type: integer
 *                             page:
 *                               type: integer
 *                             pageSize:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *       400:
 *         description: Invalid page or pageSize query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
