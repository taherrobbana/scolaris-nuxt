import { defineEventHandler, readBody, createError } from "h3";
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

    const body = await readBody(event);
    
    // Validation
    if (!body.code || !body.name || body.coefficient === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields (code, name, coefficient)",
      });
    }

    // Check if subject exists
    const subject = await db.collection("subjects").findOne({ _id: objectId });
    if (!subject) {
      throw createError({
        statusCode: 404,
        statusMessage: "Subject not found",
      });
    }

    const updatedSubject = {
      code: String(body.code),
      name: String(body.name),
      coefficient: Number(body.coefficient),
      description: body.description ? String(body.description) : undefined,
      specialty: body.specialty ? String(body.specialty) : undefined,
      createdAt: subject.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await db.collection("subjects").replaceOne({ _id: objectId }, updatedSubject);

    return {
      id: id,
      ...updatedSubject,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
