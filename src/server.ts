import { env } from "./config/env.js";
import app from './app.js';
import { prisma } from "./config/prisma.js";


const startServer = async () => {
    try{
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        const server = app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

        const shutdown = async (signal: string) => {
            console.log(`\n Received ${signal}`);
            server.close(async () => {
              await prisma.$disconnect();
              console.log("Server closed cleanly");
              process.exit(0);
            });
        };
          process.on("SIGINT", shutdown);
          process.on("SIGTERM", shutdown);
    } catch (error) {
        console.error("Failed to start server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};
      
startServer();