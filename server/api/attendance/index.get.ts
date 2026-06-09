import { defineEventHandler, createError, getQuery } from "h3";
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

    const { eventId } = getQuery(event);
    if (!eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: "eventId is required",
      });
    }

    const doc = await db.collection("attendance").findOne({ eventId: String(eventId) });
    return doc || { eventId: String(eventId), records: [] };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
