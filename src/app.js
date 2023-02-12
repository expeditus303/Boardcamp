import dotenv from "dotenv";
import express from "express";
import joi from "joi";
import pkg from "pg";
import dayjs from "dayjs";

dotenv.config();

const { Pool } = pkg;

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));

console.log(
  process.env.HOST,
  process.env.POSTGRES_PORT,
  process.env.USER_,
  process.env.PASSWORD,
  process.env.DATABASE
);

const connection = new Pool({
  host: process.env.HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.USER_,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.post("/rentals", async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;

  const rentalsSchema = joi.object({
    customerId: joi.number().min(1).integer().required(),
    gameId: joi.number().min(1).integer().required(),
    daysRented: joi.number().min(1).integer().required()
  });

  const { error } = rentalsSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(400).send(errorMessage);
  }

  const date = dayjs().format("DD-MM-YYYY");

  try {
    const customerExists = await connection.query(
      "SELECT * FROM customers WHERE id=$1;",
      [customerId]
    );

    if (!customerExists.rows[0]) return res.sendStatus(400);

    const gameExists = await connection.query(
      "SELECT * FROM games WHERE id=$1;",
      [gameId]
    );

    if (!gameExists.rows[0]) return res.sendStatus(400);

    console.log()

    if (gameExists.rows[0].stockTotal === 0) return res.status(400).send("Out of stock")

    const pricePerDay = gameExists.rows[0].pricePerDay

    const originalPrice = pricePerDay * daysRented

    await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [customerId, gameId, date, daysRented, null, originalPrice, null]
    );

    await connection.query('UPDATE games SET "stockTotal" = "stockTotal" - 1 WHERE id=$1;', [gameId])

    res.send(gameExists.rows[0]);
  } catch (error) {}
});

app.get("/rentals", async (req, res) => {
  try {

  } catch (error) {}
});

app.get("/games", async (req, res) => {
  try {
    const games = await connection.query("SELECT * FROM games");
    res.status(201).send(games.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await connection.query("SELECT * FROM customers;");
    res.send(customers.rows);
  } catch (error) {
    res.send(error);
  }
});

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.sendStatus(400);

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id=$1;`,
      [id]
    );
    if (!customer.rows[0]) return res.sendStatus(404);
    res.status(200).send(customer.rows[0]);
  } catch (error) {
    res.send(error);
  }
});

app.post("/customers", async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  const newCustomerSchema = joi.object({
    name: joi.string().min(3).required(),
    phone: joi.string().pattern(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().required(),
  });

  const { error } = newCustomerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);
  }

  try {
    const cpfExists = await connection.query(
      "SELECT * FROM customers WHERE cpf=$1",
      [cpf]
    );
    if (cpfExists.rows[0]) return res.sendStatus(409);
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.send(error);
  }
});

app.post("/games", async (req, res) => {
  const { name, image, stockTotal, pricePerDay } = req.body;

  const gamesSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().min(3).required(),
    stockTotal: joi.number().min(1).integer().required(),
    pricePerDay: joi.number().min(1).integer().required(),
  });

  const { error } = gamesSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(400).send(errorMessage);
  }

  try {
    const gameExist = await connection.query(
      "SELECT * FROM games WHERE name=$1",
      [name]
    );

    if (gameExist.rows[0]) return res.sendStatus(409);

    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const editCustomerSchema = joi.object({
    name: joi.string().min(3).required(),
    phone: joi.string().pattern(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().required(),
  });

  if (isNaN(id)) return res.sendStatus(400);

  const { error } = editCustomerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);
  }

  try {
    const cpfExists = await connection.query(
      "SELECT * FROM customers WHERE cpf=$1",
      [cpf]
    );

    if (cpfExists.rows[0]) return res.sendStatus(409);

    await connection.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});
