import NoteModel from "../models/Note";
import mongoose from "mongoose";

const isValidObjectId = (noteId: string) => {
    const checkId = !mongoose.isValidObjectId(noteId);
    return checkId;
};

const getNoteById = async (noteId: string) => {
    const note = await NoteModel.findById(noteId).exec();
    return note;
};

const notesServices = {
    isValidObjectId,
    getNoteById,
};

export default notesServices;