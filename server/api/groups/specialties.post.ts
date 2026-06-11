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
    const { groupId, specialty } = body;

    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: "groupId is required",
      });
    }

    await db.collection("group_specialties").updateOne(
      { groupId },
      { $set: { groupId, specialty } },
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
