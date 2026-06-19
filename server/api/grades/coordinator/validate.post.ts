import { defineEventHandler, createError, getHeader, readBody } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";
import { detectRoleFromHeader, decodeJWT } from "~/utils";

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

    // Only coordinators and admins can validate report cards
    if (!HeaderRole.is_coordinator && !HeaderRole.is_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Only coordinators and admins can validate report cards",
      });
    }

    const body = await readBody(event);
    const { studentId, validated, gpa, decision } = body;

    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "studentId is required",
      });
    }

    const decoded = decodeJWT(authHeader);
    const validatorUsername = decoded.payload.preferred_username || decoded.payload.username || "Coordinator";

    const updateDoc: any = {
      studentId,
      validated: !!validated,
      validatedBy: validatorUsername,
      validatedAt: new Date(),
    };

    if (gpa !== undefined) updateDoc.gpa = Number(gpa);
    if (decision !== undefined) updateDoc.decision = decision;

    // Upsert into report_cards
    const result = await db.collection("report_cards").updateOne(
      { studentId },
      { $set: updateDoc },
      { upsert: true }
    );

    return {
      success: true,
      studentId,
      validated: !!validated,
      message: validated ? "Report card validated successfully" : "Report card validation removed",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
