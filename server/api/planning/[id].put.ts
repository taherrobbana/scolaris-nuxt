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
        statusMessage: "Invalid event ID format",
      });
    }

    const body = await readBody(event);
    
    if (!body.title || !body.start || !body.end) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields (title, start, end)",
      });
    }

    const existing = await db.collection("planning").findOne({ _id: objectId });
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Event not found",
      });
    }

    const updatedEvent = {
      title: String(body.title),
      start: String(body.start),
      end: String(body.end),
      subjectId: body.subjectId ? String(body.subjectId) : undefined,
      groupId: body.groupId ? String(body.groupId) : undefined,
      teacherId: body.teacherId ? String(body.teacherId) : undefined,
      specialty: body.specialty ? String(body.specialty) : undefined,
      discription: body.discription ? String(body.discription) : "",
      class: body.class ? String(body.class) : "cours",
      createdAt: existing.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await db.collection("planning").replaceOne({ _id: objectId }, updatedEvent);

    return {
      id: id,
      ...updatedEvent,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
