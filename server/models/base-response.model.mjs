/**
 * @openapi
 * components:
 *   schemas:
 *     BaseResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 */
