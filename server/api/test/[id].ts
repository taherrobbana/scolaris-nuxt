import { defineEventHandler, readBody, createError, getMethod } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const method = getMethod(event);
    const id = event.context.params?.id;

    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database not connected",
      });
    }

    switch (method) {
      case 'GET':
        if (!id) {
          // Get all documents
          const allDocuments = await db.collection("test").find().toArray();
          return {
            success: true,
            data: allDocuments,
            message: "GET success!",
          };
        } else {
          // Get single document
          const document = await db.collection("test").findOne({ _id: new ObjectId(id) });
          if (!document) {
            throw createError({
              statusCode: 404,
              statusMessage: "Document not found",
            });
          }
          return {
            success: true,
            data: document,
            message: "GET success!",
          };
        }

      case 'PUT':
        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: "ID parameter is required for PUT",
          });
        }
        const putBody = await readBody(event);
        const putResult = await db.collection("test").replaceOne(
          { _id: new ObjectId(id) },
          { ...putBody, updatedAt: new Date() }
        );
        if (putResult.matchedCount === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: "Document not found",
          });
        }
        const putUpdated = await db.collection("test").findOne({ _id: new ObjectId(id) });
        return {
          success: true,
          data: putUpdated,
          message: "PUT success!",
        };

      case 'PATCH':
        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: "ID parameter is required for PATCH",
          });
        }
        const patchBody = await readBody(event);
        delete patchBody._id;
        delete patchBody.createdAt;
        const patchResult = await db.collection("test").updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...patchBody, updatedAt: new Date() } }
        );
        if (patchResult.matchedCount === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: "Document not found",
          });
        }
        const patchUpdated = await db.collection("test").findOne({ _id: new ObjectId(id) });
        return {
          success: true,
          data: patchUpdated,
          message: "PATCH success!",
        };

      case 'DELETE':
        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: "ID parameter is required for DELETE",
          });
        }
        const deleteResult = await db.collection("test").deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: "Document not found",
          });
        }
        return {
          success: true,
          data: { id },
          message: "DELETE success!",
        };

      default:
        throw createError({
          statusCode: 405,
          statusMessage: "Method not allowed",
        });
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});