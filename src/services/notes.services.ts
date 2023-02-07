import NoteModel from "../models/Note";
import mongoose from "mongoose";

const isValidObjectId = (noteId: string) => {
    const checkId = !mongoose.isValidObjectId(noteId);
    return checkId;
};
const getNotes = async () => {
    const notes = await NoteModel.find().exec();
    return notes;
};

const getNoteById = async (noteId: string) => {
    const note = await NoteModel.findById(noteId).exec();
    return note;
};

const createNote = async (title: string, text?: string) => {
    const newNote = await NoteModel.create({
        title,
        text
    });
    return newNote;
};

const notesServices = {
    getNotes,
    isValidObjectId,
    getNoteById,
    createNote
};

export default notesServices;