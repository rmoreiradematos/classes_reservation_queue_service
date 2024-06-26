import { QueueListener } from "../../infrastructure/messaging/queueListener";

export class RecurrencyQueueService {
  async sendToQeue(recurrency: any) {
    const queueListener = await QueueListener.getInstance();
    await queueListener.process(recurrency);
    // await queueListener.close();
  }
}
