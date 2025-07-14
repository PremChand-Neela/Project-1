// filepath: c:\Users\premc\OneDrive\Desktop\Project 1\src\index.js
import dotenv from 'dotenv';
import connectionDB from './db/index.js';
import { app } from './app.js'; // Use the app from app.js

dotenv.config({ path: './.env' });

// Start server after DB connection
connectionDB()
  .then(() => {
    const PORT = process.env.PORT || 6000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error!", error.message);
    process.exit(1);
  });