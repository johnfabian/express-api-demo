import { Router } from 'express';
import { getAllProducts } from '../controllers/products.controller.mjs';

const router = Router();

router.get('/products', getAllProducts);

export default router;
