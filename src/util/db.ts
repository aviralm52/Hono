import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI as string
    );

    console.log("Database connected 🎉");
  } catch (err) {
    console.log('Database connect nhi ho pa raha 😭')
    return console.log((err as any).message);
  }
}
