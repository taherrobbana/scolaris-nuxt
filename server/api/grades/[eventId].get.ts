import { defineEventHandler, createError, getHeader } from "h3";
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
        statusMessage: "Forbidden: Only staff and teachers can access exam grades",
      });
    }

    // 1. Get planning event details
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

    // Security check: teacher can only access their own exams
    if (HeaderRole.is_teacher && !HeaderRole.is_admin && !HeaderRole.is_coordinator) {
      const dbTeacherId = currentUser ? currentUser.id : userId;
      if (planningEvent.teacherId !== dbTeacherId) {
        throw createError({
          statusCode: 403,
          statusMessage: "Forbidden: You are not the teacher assigned to this exam",
        });
      }
    }

    // 2. Fetch the group name from MongoDB
    let groupName = "";
    if (planningEvent.groupId) {
      try {
        const groupObj = await db
          .collection("groups")
          .findOne({ _id: new ObjectId(planningEvent.groupId) });
        if (groupObj) {
          groupName = groupObj.name || groupObj.label || "";
        }
      } catch (e) {
        // fallback
        groupName = String(planningEvent.groupId);
      }
    }

    // 3. Get all students in this group
    const students = allUsers.filter(
      (u: any) => u.role === "student" && u.group === groupName,
    );

    // 4. Retrieve grades documentation from DB
    const gradeDoc = await db.collection("grades").findOne({ eventId });

    // 5. Map student list with their grades
    const records = students.map((s: any) => {
      const existingRecord = gradeDoc?.records?.find(
        (r: any) => r.studentId === s.id,
      );
      return {
        studentId: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        username: s.username,
        grade: existingRecord ? Number(existingRecord.grade) : null,
      };
    });

    return {
      eventId,
      subjectId: planningEvent.subjectId,
      groupId: planningEvent.groupId,
      records,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
