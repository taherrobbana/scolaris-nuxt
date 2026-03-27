import { defineEventHandler } from "h3";
import mongoose from "mongoose";
import { connectDB } from "~/server/utils/mongo";

export default defineEventHandler(async () => {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    
    const states = {
      0: "déconnecté",
      1: "connecté",
      2: "en connexion",
      3: "en déconnexion"
    };
    
    return {
      status: "ok",
      mongoState: states[state as keyof typeof states],
      mongoReadyState: state,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
});