import express, { Request, Response } from "express";
import { RecurrencyQueueService } from "./reservation_queue_listener.service";

export const recurrencyRouter = express.Router();
const recurrencyQeue = new RecurrencyQueueService();

recurrencyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    await recurrencyQeue.sendToQeue(body);
    return res.status(200).json({ message: "Enviado para a fila" });
  } catch (error) {
    console.log(error);
  }
});
