import { defineEventHandler, createError, getQuery } from "h3";
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

    const { studentId, groupName } = getQuery(event);
    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "studentId is required",
      });
    }

    // 1. Get all subjects
    const subjects = await db.collection("subjects").find().toArray();

    // 2. Find all planning events for the student's group
    const groups = await db.collection("groups").find().toArray();
    const matchedGroup = groups.find(
      (g) =>
        (g.name || g.label || g.id) === groupName ||
        g._id?.toString() === groupName,
    );
    const groupId = matchedGroup
      ? matchedGroup._id.toString()
      : String(groupName);

    // Get specialty mapped to this group
    const specialtyMapping = await db.collection("group_specialties").findOne({ groupId });
    const groupSpecialty = specialtyMapping ? specialtyMapping.specialty : null;

    // Filter subjects by group specialty if set
    const filteredSubjects = groupSpecialty
      ? subjects.filter((s) => s.specialty === groupSpecialty)
      : subjects;

    const planningEvents = await db
      .collection("planning")
      .find({ groupId })
      .toArray();

    // 3. Find all attendance documents for these planning events
    const eventIds = planningEvents.map((e) => e._id.toString());
    const attendanceDocs = await db
      .collection("attendance")
      .find({ eventId: { $in: eventIds } })
      .toArray();

    // 4. Calculate for each subject
    const result = filteredSubjects.map((sub) => {
      const subEvents = planningEvents.filter(
        (e) => e.subjectId === sub._id.toString(),
      );

      const absencesList: any[] = [];

      subEvents.forEach((ev) => {
        const att = attendanceDocs.find((a) => a.eventId === ev._id.toString());
        if (att) {
          const record = att.records?.find(
            (r: any) => r.studentId === studentId,
          );
          if (record && !record.present) {
            absencesList.push({
              eventId: ev._id.toString(),
              date: ev.start,
              start: ev.start,
              end: ev.end,
              description: ev.discription || ev.description || "",
            });
          }
        }
      });

      return {
        subjectId: sub._id.toString(),
        subjectCode: sub.code,
        subjectName: sub.name,
        coefficient: sub.coefficient,
        sessionsCount:
          sub.sessionsCount !== undefined ? Number(sub.sessionsCount) : 15,
        toleratedAbsences:
          sub.toleratedAbsences !== undefined
            ? Number(sub.toleratedAbsences)
            : 3,
        absencesCount: absencesList.length,
        absences: absencesList,
      };
    });

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
