import { defineEventHandler, readBody, createError } from "h3";
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

    const body = await readBody(event);
    
    // Remove any fields that shouldn't be updated
    delete body._id;
    delete body.createdAt;
    
    // Partial update (PATCH)
    const result = await db.collection("test").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found",
      });
    }

    // Fetch the updated document
    const updatedDocument = await db.collection("test").findOne({ _id: new ObjectId(id) });

    return {
      success: true,
      data: updatedDocument,
      message: "Document updated successfully!",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});