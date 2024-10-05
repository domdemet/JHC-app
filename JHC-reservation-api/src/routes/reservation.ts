import { Router, Request, Response } from "express";
import { Reservation } from "../models/reservation";

const router = Router();
const reservations: Reservation[] = [];

router.post("/reservation", (req: Request, res: Response) => {
  const reservation: Reservation = {
    reservationID: reservations.length + 1,
    userID: req.body.userID,
    timeSlot: req.body.timeSlot,
  };
  reservations.push(reservation);
});

export default router;
