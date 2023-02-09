import dotenv from "dotenv";
import express from "express";
import joi from "joi";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));

const connection = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "260989",
  database: "boardcamp",
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
    res.send(customer.rows[0]);
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

  const { error } = newCustomerSchema.validate(req.body, {abortEarly: false});

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);
  }

  try {
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

  try {
    await connection.query(
      "INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4)"
    );
    res.sendStatus(201);
  } catch (error) {}
});
