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

    const result = await db.collection("test").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found",
      });
    }

    return {
      success: true,
      data: { id },
      message: "Document deleted successfully!",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});