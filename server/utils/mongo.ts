
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const baseUri = process.env.MONGODB_URI2;
    const dbName = process.env.DB_NAME2;
    const uri = `${baseUri}/${dbName}`;

    if (!uri) {
      console.log("❌ uri is undefined !")
    } else {
      await mongoose.connect(uri);
    }

    isConnected = true;
    console.log("✅ MongoDB connecté à la base:", mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error("❌ MongoDB error:", error);
    throw error;
  }
};

// Optionnel: Fonction pour obtenir la base de données spécifique
export const getDatabase = () => {
  if (!mongoose.connection.db) {
    throw new Error("Database not connected");
  }
  return mongoose.connection.db;
};