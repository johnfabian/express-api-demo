/**
 * @swagger
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
 * @swagger
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
 *     responses:
 *       200:
 *         description: Either a full list of todos (no paging) or a single page with metadata.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 - type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Todo'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid page or pageSize query parameter.
 */
