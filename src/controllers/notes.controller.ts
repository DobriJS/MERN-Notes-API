import { RequestHandler } from "express";
import NoteModel from "../models/Note";
import { CreateNoteBody } from "../interfaces/CreateNoteBody";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { UpdateNoteParams } from "../interfaces/UpdateNoteParams";
import { UpdateNoteBody } from "../interfaces/UpdateNoteBody";
import notesServices from "../services/notes.services";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = notesServices.getNotes();

        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNoteById: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        if (notesServices.isValidObjectId(noteId)) throw createHttpError(400, 'Invalid note ID');
        if (!noteId) throw createHttpError(404, 'Note not found');
        const note = await notesServices.getNoteById(noteId);

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        if (!title) throw createHttpError(400, 'Note must have a title');
        const newNote = await notesServices.createNote(title, text);

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    try {
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, 'Invalid note ID');
        if (!newTitle) throw createHttpError(400, 'Note must have a title');
        const note = await NoteModel.findById(noteId).exec();
        if (!note) throw createHttpError(404, 'Note not found');
        note.title = newTitle;
        note.text = newText;
        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note id");
        const note = await NoteModel.findById(noteId).exec();
        if (!note) throw createHttpError(404, "Note not found");
        await note.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
