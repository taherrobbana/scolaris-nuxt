import { defineEventHandler, createError } from "h3";
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

    const mappings = await db.collection("group_specialties").find().toArray();
    return mappings.map((m) => ({
      groupId: m.groupId,
      specialty: m.specialty,
    }));
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
