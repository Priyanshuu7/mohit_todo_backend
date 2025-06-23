import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/middleware.js';
import prisma from '../config/db.js';
import { createTodoSchema, updateTodoSchema } from '../validations/todoschema.js';



// create a todo //
export const createTodo = async (req: AuthenticatedRequest, res: Response) => {

  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation error',
      errors: parsed.error.errors,
    });
  }
    
    const { title, description } = parsed.data;
  
    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          description,
          userId: req.userId!,
        },
      });
  
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create todo', error: err });
    }
  };

  // get all todos //
export const getTodos = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const todos = await prisma.todo.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
      });
  
      res.json(todos);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch todos', error: err });
    }
  };

// get todo by id //
export const getTodo = async (req:AuthenticatedRequest, res:Response) =>{
    const { id } = req.params;

    try {
        const todo = await prisma.todo.findFirst({
          where: {
            id: id,
            userId: req.userId,
          },
        });
    
        if (!todo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
    
        res.json(todo);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch todo', error: err });
      }

}


// update todo //
export const updateTodo = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const parsed = updateTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: parsed.error.errors,
      });
    }
    const { title, description, completed } = parsed.data;
  
    try {
      const existing = await prisma.todo.findFirst({
        where: {
            id: id,
          userId: req.userId,
        },
      });
  
      if (!existing) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      const updated = await prisma.todo.update({
        where: { id: existing.id },
        data: { title, description, completed },
      });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update todo', error: err });
    }
  };

  // delete todo //
  export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
  
    try {
      const existing = await prisma.todo.findFirst({
        where: {
            id: id,
          userId: req.userId,
        },
      });
  
      if (!existing) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      await prisma.todo.delete({ where: { id: existing.id } });
  
      res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete todo', error: err });
    }
  };