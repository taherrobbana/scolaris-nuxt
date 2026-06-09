import { defineEventHandler, createError, readBody } from "h3";
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
    if (!body || !body.eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: "eventId is required",
      });
    }

    const eventId = String(body.eventId);
    const records = body.records || [];

    await db.collection("attendance").updateOne(
      { eventId },
      {
        $set: {
          eventId,
          records,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
