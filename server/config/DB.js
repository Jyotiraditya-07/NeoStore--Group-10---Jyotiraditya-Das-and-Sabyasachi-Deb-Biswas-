import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(
      `Connected to database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`connection failed ${error.message}`.bgRed.white);
  }
};

export { connectDB };
