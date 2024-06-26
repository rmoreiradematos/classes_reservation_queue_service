import amqp, { Connection, Channel } from "amqplib";
import appEventEmitter from "../../infrastructure/events/appEventEmitter";

export class QueueListener {
  private static instance: QueueListener;
  private connection: Connection;
  private channel: Channel;

  private constructor() {}

  public static async getInstance(): Promise<QueueListener> {
    if (!QueueListener.instance) {
      QueueListener.instance = new QueueListener();
      await QueueListener.instance.init();
    }
    return QueueListener.instance;
  }

  private async init(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue("RECURRENCY_QUEUE", { durable: true });
  }

  public async process(recurrency: any): Promise<void> {
    if (!this.channel) {
      throw new Error("Notification manager is not initialized");
    }
    try {
      await this.channel.sendToQueue(
        "RECURRENCY_QUEUE",
        Buffer.from(JSON.stringify(recurrency)),
        {
          persistent: true,
        }
      );
      appEventEmitter.emit("recurrency");
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
