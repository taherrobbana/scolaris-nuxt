import { defineEventHandler, createError, readBody, getHeader } from "h3";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
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

    const eventId = event.context.params?.eventId;
    if (!eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: "eventId is required",
      });
    }

    const authHeader = getHeader(event, "authorization");
    const HeaderRole = detectRoleFromHeader(authHeader);
    const decoded = decodeJWT(authHeader);
    const userId = decoded.payload.sub || decoded.payload.id;

    if (
      !HeaderRole.is_coordinator &&
      !HeaderRole.is_teacher &&
      !HeaderRole.is_admin
    ) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Only staff and teachers can register exam grades",
      });
    }

    // Get planning event details
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(eventId);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid event ID format",
      });
    }

    const planningEvent = await db.collection("planning").findOne({ _id: objectId });
    if (!planningEvent) {
      throw createError({
        statusCode: 404,
        statusMessage: "Planning event not found",
      });
    }

    // Fetch user details from the auth backend to resolve teacher's database user ID
    const config = useRuntimeConfig();
    const authApiBase = config.public.authApiBase || "http://localhost:8080/api/";
    const res: any = await $fetch(`${authApiBase}users`, {
      headers: { Authorization: authHeader || "" },
    });
    const allUsers = res?.content || [];
    const username = decoded.payload.preferred_username || decoded.payload.username;
    const currentUser = allUsers.find(
      (u: any) => u.id === userId || u.username === username,
    );

    // Security check: teacher can only grade their own exams
    if (HeaderRole.is_teacher && !HeaderRole.is_admin && !HeaderRole.is_coordinator) {
      const dbTeacherId = currentUser ? currentUser.id : userId;
      if (planningEvent.teacherId !== dbTeacherId) {
        throw createError({
          statusCode: 403,
          statusMessage: "Forbidden: You are not the teacher assigned to this exam",
        });
      }
    }

    const body = await readBody(event);
    if (!body || !Array.isArray(body.records)) {
      throw createError({
        statusCode: 400,
        statusMessage: "records must be an array",
      });
    }

    // Validate grades range
    const sanitizedRecords = body.records.map((r: any) => {
      const gradeVal = r.grade === null || r.grade === undefined ? null : Number(r.grade);
      if (gradeVal !== null && (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 20)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Grade must be a number between 0 and 20",
        });
      }
      return {
        studentId: String(r.studentId),
        grade: gradeVal,
      };
    });

    await db.collection("grades").updateOne(
      { eventId },
      {
        $set: {
          eventId,
          subjectId: planningEvent.subjectId,
          groupId: planningEvent.groupId,
          teacherId: planningEvent.teacherId,
          records: sanitizedRecords,
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
