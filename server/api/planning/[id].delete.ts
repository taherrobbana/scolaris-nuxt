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
        statusMessage: "Invalid event ID format",
      });
    }

    const result = await db.collection("planning").deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Event not found",
      });
    }

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
