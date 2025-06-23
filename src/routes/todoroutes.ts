import { Router } from 'express';
import auth from '../middlewares/middleware.js';
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '../controllers/todocontroller.js';



const router = Router();


router.use(auth);

// 📝 Todo Routes
router.get('/', getTodos);             // Get all todos for logged-in user
router.get('/:id', getTodo);       // Get one todo by ID (owned by user)
router.post('/', createTodo);          // Create a new todo
router.put('/:id', updateTodo);        // Update a specific todo
router.delete('/:id', deleteTodo);     // Delete a specific todo

export default router;
