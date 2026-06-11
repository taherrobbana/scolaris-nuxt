import { defineEventHandler, createError, readBody, getHeader } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";
import { detectRoleFromHeader } from "~/utils";

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

    const authHeader = getHeader(event, "authorization");
    const HeaderRole = detectRoleFromHeader(authHeader);
    if (
      !HeaderRole.is_coordinator &&
      !HeaderRole.is_teacher &&
      !HeaderRole.is_admin
    ) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Forbidden: Only coordinators, teachers, and admins can register attendance",
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
      { upsert: true },
    );

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
