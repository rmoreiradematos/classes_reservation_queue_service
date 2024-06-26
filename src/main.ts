import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appEventEmitter from "./infrastructure/events/appEventEmitter";
import { WorkerService } from "./infrastructure/messaging/workerService";
import { recurrencyRouter } from "./application/reservation_queue_listener/reservation_queue_listener.controller";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/recurrency", recurrencyRouter);
console.log("Hello, World!", process.env.PORT);
const port = process.env.PORT || 3000;

const worker = new WorkerService(process.env.QUEUE_NAME);

async function startServices() {
  try {
    console.log("Starting worker...");
    appEventEmitter.on("recurrency", async (message) => {
      await worker.initialize();
      console.log("Worker connected and consuming messages...");
    });
  } catch (error) {
    console.error("Failed to start worker:", error);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down...");
    await worker.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down...");
    await worker.close();
    process.exit(0);
  });
}

startServices().catch(console.error);

export default app;
