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

    // Validation
    if (!body.code || !body.name || body.coefficient === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields (code, name, coefficient)",
      });
    }

    const newSubject = {
      code: String(body.code),
      name: String(body.name),
      coefficient: Number(body.coefficient),
      description: body.description ? String(body.description) : undefined,
      specialty: body.specialty ? String(body.specialty) : undefined,
      sessionsCount:
        body.sessionsCount !== undefined ? Number(body.sessionsCount) : 15,
      toleratedAbsences:
        body.toleratedAbsences !== undefined
          ? Number(body.toleratedAbsences)
          : 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("subjects").insertOne(newSubject);

    return {
      id: result.insertedId.toString(),
      ...newSubject,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
