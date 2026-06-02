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

    const docs = await db.collection("subjects").find().toArray();
    
    // Map _id to id to match Subject interface
    return docs.map((doc) => ({
      id: doc._id.toString(),
      code: doc.code,
      name: doc.name,
      coefficient: doc.coefficient,
      description: doc.description,
      specialty: doc.specialty,
    }));
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
