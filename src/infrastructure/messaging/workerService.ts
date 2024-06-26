import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import dotenv from "dotenv";
import RecurrenceFactory from "../../core/factories/recurrenceFactory";
import { saveRecurringReservations } from "../db/persistReservations";

dotenv.config();
export class WorkerService {
  private connection: Connection;
  private channel: Channel;

  constructor(private queueName: string = "RECURRENCY_QUEUE") {
    this.queueName = queueName;
  }

  public async initialize(): Promise<void> {
    await this.connect();
    await this.startConsuming();
  }

  public async connect(): Promise<void> {
    this.connection = await amqp.connect(
      process.env.RMQ_LOGIN || "amqp://localhost:5672"
    );
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    console.log(`Connected to RabbitMQ and queue ${this.queueName} is ready.`);
  }

  private async startConsuming(): Promise<void> {
    console.log(`Starting to consume messages from ${this.queueName}`);
    this.channel.consume(this.queueName, (msg) => this.onMessage(msg), {
      noAck: false,
    });
  }

  private async onMessage(msg: ConsumeMessage | null): Promise<void> {
    if (msg) {
      try {
        await this.processMessage(msg.content.toString());
        this.channel.ack(msg);
      } catch (error) {
        console.error("Failed to process message:", error);
        this.channel.nack(msg);
      }
    }
  }

  private async processMessage(data: string): Promise<void> {
    const processedData = JSON.parse(data);
    const {
      room_id,
      user_id,
      recurrence,
      start_date,
      end_date,
      period,
      hour_start,
      hour_end,
    } = processedData;

    const recurrenceFactory = new RecurrenceFactory();
    const createdRecurrency = recurrenceFactory.createRecurrence(
      room_id,
      user_id,
      start_date,
      end_date,
      { ...recurrence },
      period,
      hour_start,
      hour_end
    );

    const reservations = createdRecurrency.createReservations();

    // console.log("Reservations created", reservations);
    await saveRecurringReservations(reservations);
  }

  public async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
