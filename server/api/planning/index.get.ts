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

    const docs = await db.collection("planning").find().toArray();
    
    // Map _id to id
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      start: doc.start,
      end: doc.end,
      subjectId: doc.subjectId,
      groupId: doc.groupId,
      teacherId: doc.teacherId,
      specialty: doc.specialty,
      discription: doc.discription || doc.description || "",
      class: doc.class || "meeting",
    }));
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
