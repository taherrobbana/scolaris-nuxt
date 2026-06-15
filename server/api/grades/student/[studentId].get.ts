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

    const studentId = event.context.params?.studentId;
    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "studentId is required",
      });
    }

    const authHeader = getHeader(event, "authorization");
    const HeaderRole = detectRoleFromHeader(authHeader);
    const decoded = decodeJWT(authHeader);
    const userId = decoded.payload.sub || decoded.payload.id;

    // Fetch user details from the auth backend to resolve student's database user ID
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

    // Security check: students can only fetch their own grades
    if (HeaderRole.is_student) {
      const dbStudentId = currentUser ? currentUser.id : userId;
      if (dbStudentId !== studentId) {
        throw createError({
          statusCode: 403,
          statusMessage: "Forbidden: You can only view your own grades",
        });
      }
    }

    // 1. Fetch all grades documents that contain this student
    const gradesDocs = await db
      .collection("grades")
      .find({ "records.studentId": studentId })
      .toArray();

    // 2. Load planning events and subjects to populate details
    const planningIds = gradesDocs.map((d) => {
      try {
        return new ObjectId(d.eventId);
      } catch {
        return null;
      }
    }).filter(Boolean) as ObjectId[];

    const planningEvents = await db
      .collection("planning")
      .find({ _id: { $in: planningIds } })
      .toArray();

    const subjects = await db.collection("subjects").find().toArray();

    // 3. Construct individual grades info
    const gradesList: any[] = [];
    let weightedSum = 0;
    let coefficientSum = 0;

    gradesDocs.forEach((doc) => {
      const studentRecord = doc.records?.find((r: any) => r.studentId === studentId);
      if (studentRecord && studentRecord.grade !== null && studentRecord.grade !== undefined) {
        const grade = Number(studentRecord.grade);
        const planningEvent = planningEvents.find((e) => e._id.toString() === doc.eventId);
        
        // Find subject
        const subjectId = doc.subjectId || planningEvent?.subjectId;
        const subject = subjects.find((s) => s._id.toString() === subjectId);

        const subjectName = subject ? subject.name : (planningEvent?.title || "Matière inconnue");
        const subjectCode = subject ? subject.code : "";
        const coefficient = subject && subject.coefficient !== undefined ? Number(subject.coefficient) : 1;

        gradesList.push({
          eventId: doc.eventId,
          subjectId,
          subjectName,
          subjectCode,
          coefficient,
          grade,
          examDate: planningEvent?.start || "",
          examTitle: planningEvent?.title || "",
        });

        weightedSum += grade * coefficient;
        coefficientSum += coefficient;
      }
    });

    // Sort grades by exam date descending
    gradesList.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());

    // 4. Calculate stats
    const gpa = coefficientSum > 0 ? Number((weightedSum / coefficientSum).toFixed(2)) : 0;

    let status = "pending";
    if (coefficientSum > 0) {
      if (gpa >= 10) {
        status = "admitted";
      } else if (gpa >= 8) {
        status = "resit";
      } else {
        status = "failed";
      }
    }

    return {
      studentId,
      grades: gradesList,
      gpa,
      coefficientSum,
      status,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
