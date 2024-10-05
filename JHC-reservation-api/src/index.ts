import "dotenv/config";
import express, { Request, Response } from "express";
import { Model, DataTypes, where } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import bodyParser from "body-parser";
const cors = require("cors");
import { Op } from "sequelize";

require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

class Reservation extends Model {}
Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: DataTypes.INTEGER,
    timeSlot: DataTypes.INTEGER,
    weekday: DataTypes.INTEGER,
    state: DataTypes.STRING,
  },
  { sequelize, modelName: "reservation" }
);
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
sequelize.sync();

//get all reservations
app.get("/reservations", async (req: Request, res: Response, next) => {
  const reservation = await Reservation.findAll();
  res.json(reservation);
});

//get every reservations for one user
app.get(
  "/reservations/user:userID",
  async (req: Request, res: Response, next) => {
    console.log("get every reservations for one user");
    const reservations = await Reservation.findAll({
      where: {
        userID: req.params.userID,
      },
    });
    res.json(reservations);
  }
);

app.get(
  "/reservations/:weekday/:timeslot",
  async (req: Request, res: Response, next) => {
    console.log("get every reservations for one user");
    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          { weekday: req.params.weekday },
          { timeSlot: req.params.timeslot },
        ],
      },
    });
    res.json(reservations);
  }
);

app.post(
  "/reservations/:weekday/:timeslot",
  async (req: Request, res: Response, next) => {
    console.log("get every reservations for one user");
    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          { weekday: req.params.weekday },
          { timeSlot: req.params.timeslot },
        ],
      },
    });
    if (reservations) {
      await reservations[0].update(req.body);
      res.json(reservations);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  }
);

//get reservation by ID
app.get("/reservations/:id", async (req: Request, res: Response) => {
  const reservation = await Reservation.findByPk(req.params.id);
  res.json(reservation);
});

//create new reservation
app.post("/reservations", async (req: Request, res: Response, next) => {
  const reservation = await Reservation.create(req.body);
  res.status(201).json(reservation);
  console.log("New reservation created");
});

//cahange reservation
app.post("/reservations/:id", async (req: Request, res: Response, next) => {
  console.log(req.body);
  const reservation = await Reservation.findByPk(req.params.id);
  if (reservation) {
    console.log("request below");
    console.log(req);
    console.log("reservation found");
    console.log(reservation);
    await reservation.update(req.body);
    res.json(reservation);
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});

//delete reservation
app.delete("/reservations/:id", async (req: Request, res: Response) => {
  const reservation = await Reservation.findByPk(req.params.id);
  console.log(reservation);
  if (reservation) {
    await reservation.destroy();
    res.json({ message: "Reservation deleted" });
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
