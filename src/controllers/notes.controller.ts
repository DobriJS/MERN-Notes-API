import { RequestHandler } from "express";
import { CreateNoteBody } from "../interfaces/CreateNoteBody";
import createHttpError from "http-errors";
import NoteModel from "../models/Note";
import { UpdateNoteParams } from "../interfaces/UpdateNoteParams";
import { UpdateNoteBody } from "../interfaces/UpdateNoteBody";
import notesServices from "../services/notes.services";
import { assertIsDefined } from "../util/assertIsDefined";


export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();

        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNoteById: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (notesServices.isValidObjectId(noteId))
            throw createHttpError(400, 'Invalid note ID');

        const note = await notesServices.getNoteById(noteId);

        if (!noteId)
            throw createHttpError(404, 'Note not found');

        if (!note?.userId.equals(authenticatedUserId))
            throw createHttpError(401, 'You cannot access this note');

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);

        if (!title)
            throw createHttpError(400, 'Note must have a title');

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (notesServices.isValidObjectId(noteId))
            throw createHttpError(400, 'Invalid note ID');

        if (!newTitle)
            throw createHttpError(400, 'Note must have a title');

        const note = await notesServices.getNoteById(noteId);

        if (!note)
            throw createHttpError(404, 'Note not found');

        if (!note?.userId.equals(authenticatedUserId))
            throw createHttpError(401, 'You cannot access this note');

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
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (notesServices.isValidObjectId(noteId))
            throw createHttpError(400, "Invalid note id");

        const note = await notesServices.getNoteById(noteId);

        if (!note)
            throw createHttpError(404, "Note not found");

        if (!note?.userId.equals(authenticatedUserId))
            throw createHttpError(401, 'You cannot access this note');

        await note.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
