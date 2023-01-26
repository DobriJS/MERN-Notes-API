import { RequestHandler } from "express";
import NoteModel from "../models/Note";
import { CreateNoteBody } from "../interfaces/CreateNoteBody";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNoteById: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note ID');
        }
        if (!noteId) {
            throw createHttpError(404, 'Note not found');
        }
        const note = await NoteModel.findById(noteId).exec();
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        if (!title) {
            throw createHttpError(400, 'Note must have a title');
        }
        const newNote = await NoteModel.create({
            title,
            text
        });
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

