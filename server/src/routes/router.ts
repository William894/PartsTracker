import * as express from 'express';
import PartsController from '../controllers/parts.controller';
import validationMiddleware from '../middleware/validation.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';
import CreatePartDto from '../models/parts/part.dto';

const router = express.Router();

/**
 * @swagger
 * /api/parts:
 *   post:
 *     summary: Create a new part
 *     tags: [Parts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePartDto'
 *     responses:
 *       201:
 *         description: Part created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Part'
 */
router.post('/parts', validationMiddleware(CreatePartDto), PartsController.createPart);

/**
 * @swagger
 * /api/parts:
 *   get:
 *     summary: Get all parts
 *     tags: [Parts]
 *     responses:
 *       200:
 *         description: List of parts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Part'
 */
router.get('/parts', cacheMiddleware, PartsController.getAllParts);

/**
 * @swagger
 * /api/parts/{id}:
 *   get:
 *     summary: Get part by ID
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Part ID
 *     responses:
 *       200:
 *         description: Part found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Part'
 *       404:
 *         description: Part not found
 */
router.get('/parts/:id', cacheMiddleware, PartsController.getPartById);

/**
 * @swagger
 * /api/parts/{id}:
 *   patch:
 *     summary: Update part by ID
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Part ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePartDto'
 *     responses:
 *       200:
 *         description: Part updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Part'
 *       404:
 *         description: Part not found
 */
router.patch('/parts/:id', validationMiddleware(CreatePartDto, true), PartsController.updatePart);

/**
 * @swagger
 * /api/parts/{id}:
 *   delete:
 *     summary: Delete part by ID
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Part ID
 *     responses:
 *       204:
 *         description: Part deleted successfully
 *       404:
 *         description: Part not found
 */
router.delete('/parts/:id', PartsController.deletePart);

export default router;