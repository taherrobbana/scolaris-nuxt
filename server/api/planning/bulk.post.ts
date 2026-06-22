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
    
    if (!Array.isArray(body)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request body must be an array of events",
      });
    }

    if (body.length === 0) {
      return [];
    }

    const newEvents = body.map((item: any) => {
      if (!item.title || !item.start || !item.end) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing required fields (title, start, end) in one or more events",
        });
      }

      return {
        title: String(item.title),
        start: String(item.start),
        end: String(item.end),
        subjectId: item.subjectId ? String(item.subjectId) : undefined,
        groupId: item.groupId ? String(item.groupId) : undefined,
        teacherId: item.teacherId ? String(item.teacherId) : undefined,
        specialty: item.specialty ? String(item.specialty) : undefined,
        discription: item.discription ? String(item.discription) : "",
        class: item.class ? String(item.class) : "cours",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const result = await db.collection("planning").insertMany(newEvents);
    
    // Construct response with inserted IDs
    const response = newEvents.map((evt, idx) => ({
      id: result.insertedIds[idx].toString(),
      ...evt,
    }));

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
