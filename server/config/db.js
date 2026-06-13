const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      retries += 1;
      console.log(`Retrying in 5 seconds... (${retries}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.error("Failed to connect to MongoDB after multiple retries. Exiting...");
  process.exit(1);
};

module.exports = connectDB;
