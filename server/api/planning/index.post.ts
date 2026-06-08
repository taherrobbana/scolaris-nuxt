import { defineEventHandler, readBody, createError } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";

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

    const body = await readBody(event);
    
    if (!body.title || !body.start || !body.end) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields (title, start, end)",
      });
    }

    const newEvent = {
      title: String(body.title),
      start: String(body.start),
      end: String(body.end),
      subjectId: body.subjectId ? String(body.subjectId) : undefined,
      groupId: body.groupId ? String(body.groupId) : undefined,
      teacherId: body.teacherId ? String(body.teacherId) : undefined,
      specialty: body.specialty ? String(body.specialty) : undefined,
      discription: body.discription ? String(body.discription) : "",
      class: body.class ? String(body.class) : "cours",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("planning").insertOne(newEvent);
    
    return {
      id: result.insertedId.toString(),
      ...newEvent,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
