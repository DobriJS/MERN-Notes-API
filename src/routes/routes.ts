import express from 'express';
import * as NotesController from '../controllers/notes.controller';

const router = express.Router();

router.get('/', NotesController.getNotes);

router.get('/:noteId', NotesController.getNoteById);

router.post('/', NotesController.createNote);

router.patch('/:noteId', NotesController.updateNote);

export default router;