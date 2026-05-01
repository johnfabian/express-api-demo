import { Router } from 'express';
import { getAllTodos } from '../controllers/todos.controller.mjs';

const router = Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Todo API!');
});

router.get('/todos', getAllTodos);

export default router;
