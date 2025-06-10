import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Spotify"
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to database: ", error.message);
    } else {
      console.error("An unknown error occurred while connecting to database.", error);
    }
    process.exit(1);
  }
};