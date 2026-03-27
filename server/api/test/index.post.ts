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
    
    // Add timestamps
    const newDocument = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("test").insertOne(newDocument);
    
    // Fetch the created document
    const createdDocument = await db.collection("test").findOne({ _id: result.insertedId });

    return {
      success: true,
      data: createdDocument,
      message: "Document created successfully!",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});