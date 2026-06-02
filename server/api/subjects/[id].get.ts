import { defineEventHandler, createError } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database not connected",
      });
    }

    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID parameter is required",
      });
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid subject ID format",
      });
    }

    const subject = await db.collection("subjects").findOne({ _id: objectId });
    if (!subject) {
      throw createError({
        statusCode: 404,
        statusMessage: "Subject not found",
      });
    }

    return {
      id: subject._id.toString(),
      code: subject.code,
      name: subject.name,
      coefficient: subject.coefficient,
      description: subject.description,
      specialty: subject.specialty,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
