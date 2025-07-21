// // src/queues/email.processor.ts
// import redisClient from "@/core/cache/redis.client";
// import { Job, Worker } from "bullmq";

import redisClient from "@/core/cache/redis.client";
import { Worker } from "bullmq";
import { EmailJobData } from "../queue.types";

// // This function will be called for each job in the 'emailQueue'
// const emailProcessor = async (job: Job) => {
//   console.log(`Processing job ${job.id} of type ${job.name}...`);
//   console.log("Job data:", job.data);

//   // Simulate some async work, like sending an email
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   console.log(`Email Sending Queue is called for job ${job.id}!`);
//   // In a real scenario, you'd send the email here
//   // e.g., sendEmail(job.data.email, job.data.name, job.data.id);

//   // If the job fails, throw an error
//   // throw new Error("Failed to send email!");
// };

// // Instantiate the worker
// export const emailWorker = new Worker("emailQueue", emailProcessor, {
//   connection: redisClient,
//   concurrency: 5, // Process up to 5 jobs concurrently
//   // Add options like `limiter` for rate limiting, `backoff` for retries, etc.
// });

// emailWorker.on("completed", (job) => {
//   console.log(`Job ${job.id} completed!`);
// });

// emailWorker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} failed with error: ${err.message}`);
// });

// emailWorker.on("active", (job) => {
//   console.log(`Job ${job.id} is now active.`);
// });

// console.log("Email Worker initialized and listening for jobs...");

// // It's good practice to handle graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("Shutting down worker...");
//   await emailWorker.close();
//   console.log("Worker shut down.");
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("Shutting down worker...");
//   await emailWorker.close();
//   console.log("Worker shut down.");
//   process.exit(0);
// });

const processor = async (job: { name: string; data: EmailJobData }) => {
  switch (job.data.type) {
    case "reset-password":
      // return handleResetPassword(job.data.payload);
      console.log("Handle reset-password");
      return;
    case "welcome-email":
      console.log("Welcome email");
      return;
    // return handleWelcomeEmail(job.data.payload);
    default:
      throw new Error(`Unknown email job type: ${job.data.type}`);
  }
};

export const emailWorker = new Worker("email", processor, {
  connection: redisClient,
  concurrency: 5,
});
