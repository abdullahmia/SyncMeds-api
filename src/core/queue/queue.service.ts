import { EmailJobData, EmailJobType } from "./queue.types";
import { emailQueue } from "./queues/email.queue";

export class QueueService {
  async addEmailJob(type: EmailJobType, payload: EmailJobData["payload"]) {
    return emailQueue.add(type, { type, payload });
  }

  async startWorkers() {
    // Workers are automatically initialized when imported
    // Additional worker management can go here
  }
}

export const queueService = new QueueService();
