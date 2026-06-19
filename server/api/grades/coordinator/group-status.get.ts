import { defineEventHandler, createError, getHeader, getQuery } from "h3";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
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

    const { groupId } = getQuery(event);
    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: "groupId query parameter is required",
      });
    }

    const authHeader = getHeader(event, "authorization");
    const HeaderRole = detectRoleFromHeader(authHeader);

    // Only coordinators and admins can validate or view group statuses
    if (!HeaderRole.is_coordinator && !HeaderRole.is_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Only coordinators and admins can view group grades status",
      });
    }

    // 1. Get group details to resolve name
    let groupName = "";
    try {
      const groupObj = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(String(groupId)) });
      if (groupObj) {
        groupName = groupObj.name || groupObj.label || "";
      }
    } catch (e) {
      groupName = String(groupId);
    }

    // 2. Fetch users to find students of this group
    const config = useRuntimeConfig();
    const authApiBase = config.public.authApiBase || "http://localhost:8080/api/";
    const res: any = await $fetch(`${authApiBase}users`, {
      headers: { Authorization: authHeader || "" },
    });
    const allUsers = res?.content || [];
    const students = allUsers.filter(
      (u: any) => u.role === "student" && u.group === groupName,
    );

    // 3. Find the specialty mapped to this group to identify subjects
    const specialtyMapping = await db
      .collection("group_specialties")
      .findOne({ groupId: String(groupId) });
    const groupSpecialty = specialtyMapping ? specialtyMapping.specialty : null;

    // Get all subjects
    const allSubjects = await db.collection("subjects").find().toArray();
    // Filter subjects by specialty if defined
    const groupSubjects = groupSpecialty
      ? allSubjects.filter((s) => s.specialty === groupSpecialty)
      : allSubjects;

    // 4. Find all exam planning events for this group
    const planningEvents = await db
      .collection("planning")
      .find({ groupId: String(groupId), class: "exam" })
      .toArray();

    // 5. Fetch grades documents for these events
    const eventIds = planningEvents.map((e) => e._id.toString());
    const gradesDocs = await db
      .collection("grades")
      .find({ eventId: { $in: eventIds } })
      .toArray();

    // 6. Fetch report card validations from report_cards
    const studentIds = students.map((s: any) => s.id);
    const validations = await db
      .collection("report_cards")
      .find({ studentId: { $in: studentIds } })
      .toArray();

    // 7. For each student, compile grades, check subjects coverage, calculate GPA and decision
    const statusList = students.map((s: any) => {
      const studentId = s.id;
      let weightedSum = 0;
      let coefficientSum = 0;
      let gradedSubjectsCount = 0;

      // Group subjects evaluation status
      const subjectGrades = groupSubjects.map((sub) => {
        const subId = sub._id.toString();
        // Find if there is an exam event for this subject in the group
        const subjectEvents = planningEvents.filter((e) => e.subjectId === subId);
        
        let gradeValue: number | null = null;
        let isGraded = false;

        // Check if there is an exam event for this subject and a grade has been entered
        for (const evt of subjectEvents) {
          const gradeDoc = gradesDocs.find((d) => d.eventId === evt._id.toString());
          const record = gradeDoc?.records?.find((r: any) => r.studentId === studentId);
          if (record && record.grade !== null && record.grade !== undefined) {
            gradeValue = Number(record.grade);
            isGraded = true;
            break;
          }
        }

        const coef = sub.coefficient !== undefined ? Number(sub.coefficient) : 1;
        if (isGraded && gradeValue !== null) {
          weightedSum += gradeValue * coef;
          coefficientSum += coef;
          gradedSubjectsCount++;
        }

        return {
          subjectId: subId,
          name: sub.name,
          code: sub.code,
          grade: gradeValue,
          isGraded,
        };
      });

      const gpa = coefficientSum > 0 ? Number((weightedSum / coefficientSum).toFixed(2)) : 0;
      let decision = "pending";
      if (coefficientSum > 0) {
        if (gpa >= 10) {
          decision = "admitted";
        } else if (gpa >= 8) {
          decision = "resit";
        } else {
          decision = "failed";
        }
      }

      // Check if report card is validated
      const valDoc = validations.find((v) => v.studentId === studentId);
      const isCardValidated = valDoc ? !!valDoc.validated : false;

      return {
        studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        username: s.username,
        email: s.email,
        gpa,
        decision,
        totalSubjects: groupSubjects.length,
        gradedSubjectsCount,
        allGradesEntered: gradedSubjectsCount >= groupSubjects.length,
        validated: isCardValidated,
        validatedAt: valDoc?.validatedAt || null,
        validatedBy: valDoc?.validatedBy || null,
        subjectGrades,
      };
    });

    return {
      success: true,
      groupId,
      groupName,
      students: statusList,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
